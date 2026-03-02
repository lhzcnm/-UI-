<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import ImportPlane from '../components/ImportPlane.vue'
import TableColumnDialog from '../components/TableColumnDialog.vue'

import { XTag, type XBtnSplitOptions, type XTableColumn, type XTableExpose } from '@3un/ui'
import { SUBMIT_STORE } from '../utils'
import { getDefaultColumns, getDefaultResultColumns } from '../utils/columns'
import { serviceApi, type FieldMap, type Service, type ServiceCols } from '@/api/services'
import { orderApi, type Order, type OrderSubmitResult, type OrderTableView, type ServiceColumnItem, type SubmitOrderListParams } from '@/api/orders'
import { ASYNC_ORDER_STATUS, ASYNC_ORDER_STATUS_MAP, debounce, downloadURL, ORDER_STATUS, ORDER_VERIFY, xconfirm } from '@3un/utils'
import { h } from 'vue'
import { toast } from 'vue-sonner'
import router from '@/router'

const store = inject(SUBMIT_STORE)!

const { t, locale } = useI18n()
const serviceStore = useServiceStore()
const uStore = useUserStore()
const { connect, close } = useWsStore()

const disabled = ref(false)
const selService = ref<Service>()
const serviceColumns = ref<ServiceColumnItem[]>([])
const showAll = ref(false)
const submited = ref<boolean>(false)
const tableRef = ref<XTableExpose | null>(null)
const imeis = ref<string[]>([])
const comments = ref<string>('')
const loading = ref(false)
const submitLoading = ref(false)
const threads = ref(5)
const pushMsg = ref(true)
const reseted = ref<boolean>(false)
const exportLoading = ref(false)

const columns = shallowRef<XTableColumn[]>(getDefaultColumns(t))

const threadKey = import.meta.env.VITE_THREAD_STORAGE

const btnSplitOpts: XBtnSplitOptions = [
  {
    label: t("query.fields.title.reset.cover.success"),
    icon: "",
    command: () => resetOrder(ORDER_STATUS.SUCCESS),
  },
  {
    label: t("query.fields.title.reset.cover.failed"),
    icon: "",
    command: () => resetOrder(ORDER_STATUS.FAILED),
  },
  {
    label: t("query.fields.title.reset.noCover.success"),
    icon: "",
    command: () => resetNotCoverOrder(ORDER_STATUS.SUCCESS),
  },
  {
    label: t("query.fields.title.reset.noCover.failed"),
    icon: "",
    command: () => resetNotCoverOrder(ORDER_STATUS.FAILED),
  },
]
const sizes = [50, 150, 200, 300, 500]

let count = 0
let headers: string[] = []
let cacheImei: boolean = false
let pendingOrders: number[] = []
let orderImeis: Record<string, number> = {}
let indexes: number[] = []
let deletedColumns: XTableColumn[] = []

watch(
  () => store.selectId,
  (val) => {
    if (val !== undefined) {
      handleSelected(val)
    } 
  }
)

const isEn = computed(() => locale.value === 'en')

const orders = computed(() => {
  return store.rawOrders.slice(
    (store.page - 1) * store.limit,
    store.page * store.limit
  )
})

const mustRead = computed(() => {
  const service = serviceStore.services.get(store.selectId!)
  return service ? service.mustRead : null
})

async function handleSelected(value: number) {
  if (!value) return
  store.page = 1
  close()

  store.rawOrders.length = 0
  count = 0
  disabled.value = false
  
  selService.value = serviceStore.services.get(value)!
  
  await handleServiceCols(value)
  
  const key = import.meta.env.VITE_SUBMIT_STORGE
  const isStoraged = localStorage.getItem(`${key}_${value}`)
  if (isStoraged) {
    await handleSubmitOrder(value)
  }

  const { data } = await orderApi.cacheImei({ serviceId: value })
  if (data.length > 0) {
    cacheImei = true
    await handleImport(data, '')
  }
}

async function handleServiceCols(value: number) {
  const { data } = await serviceApi.header(value)

  headers = data.map(item => (isEn.value ? (item.nameEn ? item.nameEn : item.name) : item.name))
  serviceColumns.value = data.map(item => ({ name: item.name, nameEn: item.nameEn }))
  store.serviceCols = data.map(item => ({
    key: isEn.value ? (item.nameEn ? item.nameEn : item.name) : item.name,
    title: isEn.value ? (item.nameEn ? item.nameEn : item.name) : item.name,
    width: item.width,
    minWidth: item.width,
    isDynamic: true,
  }))

  if (selService.value?.isUnlock) {
    columns.value = asyncServiceMergeColumns(generateColumns(store.serviceCols))
  } else {
    columns.value = mergeColumns(generateColumns(store.serviceCols))
  }

  store.selectHeaders = columns.value.filter(c => c.isColDel).map(c => c.key.toString())
}

function generateColumns(headers: ServiceCols[]) {
  const columns: XTableColumn[] = []

  for (let item of headers) {
    columns.push({
      key: item.key,
      title: item.title,
      minWidth: item.width,
      isColDel: true,
      isFilter: true,
      isDrag: item.isDynamic ? true : false,
      showNullOrWhitespace: true,
      render: (value) => {
        return h("div", {
          innerHTML: value
        })
      }
    })
  }

  return columns
}

function asyncServiceMergeColumns(serviceCols: XTableColumn[]): XTableColumn[] {
  const defaultCols = getDefaultColumns(t)
  const len = defaultCols.length
  const frontCols = defaultCols.slice(0, serviceCols.length > 0 ? len - 2 : len - 1)
  const endCols = defaultCols.slice(-1)

  const asyncCols: XTableColumn[] = [
    {
      key: 'submitedStatus',
      title: t('query.listCol.submited'),
      width: 158,
      render: (value, row) => {
        let status
        if (!value) {
          status = ASYNC_ORDER_STATUS_MAP[ASYNC_ORDER_STATUS.ASYNC_SUBMITED]

          if (row.status === ORDER_STATUS.WAIT) {
            status = ASYNC_ORDER_STATUS_MAP[ASYNC_ORDER_STATUS.WAIT]
          }
        } else {
          status = ASYNC_ORDER_STATUS_MAP[value]
        }

        return h(XTag, {
          color: status.color,
          label: t(status.key!),
        })
      }
    }
  ]

  frontCols.splice(4, 0, ...asyncCols)

  return [
    ...frontCols,
    ...serviceCols,
    ...endCols,
  ]
}

function mergeColumns(serviceCols: XTableColumn[]): XTableColumn[] {
  const defaultCols = getDefaultColumns(t)

  const len = defaultCols.length
  let frontCols = defaultCols
  let end = len - 1
  if (serviceCols.length > 0) {
    end = len - 2
  }
  frontCols = defaultCols.slice(0, end)
  const endCols = defaultCols.slice(-1)

  store.serviceCols = [
    ...store.serviceCols,
    ...endCols.filter(c => c.isColDel).map(c => ({
      key: c.key.toString(),
      title: c.title!,
      minWidth: c.minWidth,
      isDynamic: false,
    }))
  ]

  return [
    ...frontCols,
    ...serviceCols,
    ...endCols
  ]
}

async function handleSubmitOrder(id: number) {
  const key = import.meta.env.VITE_SUBMIT_STORGE
  const jsonStr = localStorage.getItem(`${key}_${id}`)

  const idList = (jsonStr && !showAll.value) ? JSON.parse(jsonStr) as number[] : []

  const data = await getSubmitOrderList(idList)

  submited.value = true

  store.rawOrders = data.map((item, i) => ({
    ...item,
    ...(processOrderResult(item.result)),
    index: i + 1,
  }))

  pendingOrders = data.map(item => {
    if (item.status === ORDER_STATUS.PROCESSING) {
      return item.id
    }
    return null
  }).filter((item): item is number => item !== null)
}

async function handleImport(imeiList: string[], remark: string) {
  if (!selService.value) return
  if (count > 0 && !selService.value?.isUnlock) return

  store.page = 1
  tableRef.value?.initFilter()
  close()

  if (!cacheImei) {
    await orderApi.cacheImei({ imeiList, serviceId: selService.value.id })
  }

  const submitedOrders = processWaitList(store.selectId!, imeiList, remark)

  store.rawOrders.splice(0, 0, ...submitedOrders)
  submited.value = false
  imeis.value = imeiList
  comments.value = remark
  count = imeiList.length
  cacheImei = false
}

async function getSubmitOrderList(orderIds: number[]) {
  loading.value = true
  const params: SubmitOrderListParams = {
    serviceId: store.selectId!,
    codeIdList: orderIds,
    showAll: showAll.value,
  }
  const { data } = await orderApi.submitOrders(params)
  loading.value = false

  setTimeout(() => {
    disabled.value = false
  }, 1500)

  return data
}

function processOrderResult(content: string) {
  const result: Record<string, string> = {}
  const items = content.split('<br>')

  const keyMap = getFieldsMap(serviceColumns.value)

  if (items.length === 1 && serviceColumns.value.length === 1) {
    const key = isEn.value ? (serviceColumns.value[0].nameEn ?? serviceColumns.value[0].name) : serviceColumns.value[0].name
    result[key] = content
  } else {
    for (const item of items) {
      const [key, ...valueParts] = item.split(/[:：]/)
      const rawKey = key.trim()
      const value = valueParts.join(":").trim()

      const mapped = keyMap[rawKey]
      if (!mapped) continue

      const finalKey = isEn.value ? mapped.en ? mapped.en : mapped.cn : mapped.cn
      result[finalKey] = value
    }
  }

  const isSuccess = judgeOrderStatus(serviceColumns.value, items)

  if (!isSuccess) {
    result[headers[0]] = content
  }

  return result
}

function processWaitList(id: number, imeiList: string[], remark: string) {
  const service = serviceStore.services.get(id)
  const buckets: OrderTableView[] = []

  for (let i = 0; i < imeiList.length; i++) {
    const initData: any = {
      id: 0, index: i + 1,
      serviceId: service ? service.id : null,
      serviceName: service ? service.title : null,
      credits: service ? service.price : 0,
      status: ORDER_STATUS.WAIT,
      submitedStatus: ASYNC_ORDER_STATUS.WAIT,
      verify: ORDER_VERIFY.NORMAL,
      imei: imeiList[i],
      remark: remark,
      result: '',
      createTime: '',
    }

    serviceColumns.value.forEach(item => {
      const name = isEn.value ? item.nameEn : item.name
      initData[name!] = ""
    })

    buckets.push(initData)
  }

  return buckets
}

function getFieldsMap(fields: ServiceColumnItem[]) {
  const fieldsCN = fields.map(item => item.name)
  const fieldsEN = fields.map(item => item.nameEn)
  const result: Record<string, FieldMap> = {}

  for (let i = 0; i < fieldsCN.length; i++) {
    const cn = fieldsCN[i]
    const en = fieldsEN[i]

    result[cn] = { cn, en }

    if (en !== null && en !== "") {
      result[en] = { cn, en }
    }
  }

  return result
}

function judgeOrderStatus(fields: ServiceColumnItem[], items: string[]) {
  const fieldsCN = fields.map(item => item.name)
  const fieldsEN = fields.map(item => item.nameEn)

  return items.some(item => {
    let texts = item.split(":")

    return texts.some(text => {
      return fieldsCN.includes(text) || fieldsEN.includes(text)
    })
  })
}

async function handleSubmit() {
  if (submitLoading.value) return

  const submitOrders = store.rawOrders.map(item => {
    if (item.status === ORDER_STATUS.WAIT) {

      return item
    }
    return null
  }).filter(Boolean)

  if (submited.value || submitOrders.length === 0) return toast.warning(t('query.prompt.repeat'))
  const service = serviceStore.services.get(store.selectId!)

  if (!service) return toast.warning(t('query.prompt.serviveNull'))
  if (orders.value.length === 0) return toast.warning(t('query.prompt.importNull'))
  submitLoading.value = true

  if (count === 0) {
    count = imeis.value.length
  }

  disabled.value = true

  await serviceApi.setThread(threads.value)

  if (service.isUnlock) return submitOrder(service)
  submitQueryOrder(service)
}

function submitOrder(service: Service) {
  const params = {
    groupId: service.parentId,
    serviceId: service.id,
    imeiList: imeis.value,
    remark: comments.value,
    isBulk: !pushMsg.value,
    language: locale.value,
  }

  const response = orderApi.submit(params)
  submited.value = true
  response.then(({ data }) => {
    serviceStore.addRecentService(service.id)

    if (service.isUnlock) {
      toast.success(`${t('submit.success', { action: t('action.submit') })}`)
      disabled.value = false
    }

    pendingOrders = data
      .map(item => item.status === ORDER_STATUS.PROCESSING ? item.codeId : null)
      .filter((x): x is number => x !== null)

    uStore.updateCredit()
    renderSubmitOrderResult(data)
  })

  response.catch((err) => {
    console.error(`[3un] ${t('submit.fail', { action: t('query.submit') })}`, err)
    submited.value = false
    close()
  })

  response.finally(() => {
    submitLoading.value = false
    imeis.value = []
    reseted.value = false
  })
}

function submitQueryOrder(service: Service) {
  const { data, status } = connect({
    serviceId: service.id,
    type: 'order'
  })

  watch(
    status,
    (value) => {
      if (value !== 'OPEN') {
        console.warn(`[3un] WebSocket ${t('action.submit.fail', { action: t('action.connect') })}`, value)
        return
      }

      submitOrder(service)
    },
    { once: true }
  )

  watch(data, (value) => {
    if (!value) return

    handleOrder(value)
    handleCount()
  })
}

function renderSubmitOrderResult(data: OrderSubmitResult[]) {
  const errMsgCol = headers[0]

  for (let item of data) {
    let index = store.rawOrders.findIndex(order => order.imei === item.imei)
    const keys = Object.keys(orderImeis)
    if (keys.includes(item.imei)) {
      index = orderImeis[item.imei]
    }

    if (index === -1) return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, item)

    const isFailed = item.status === ORDER_STATUS.FAILED
    if (isFailed) handleCount()

    store.rawOrders[index] = {
      ...store.rawOrders[index],
      ...({ [errMsgCol]: item.message }),
      result: item.message,
      status: item.status,
      submitedStatus: item.status === ORDER_STATUS.FAILED ? ASYNC_ORDER_STATUS.ASYNC_FAILED : undefined,
      id: item.codeId,
    }
  }

  const key = import.meta.env.VITE_SUBMIT_STORGE
  const service = serviceStore.services.get(store.selectId!)
  let idList = data.map(item => item.codeId).filter((x): x is number => x !== null)
  if (imeis.value && !showAll.value) {
    idList = store.rawOrders.map(item => item.id).filter((x): x is number => x !== null)
  }
  localStorage.setItem(`${key}_${service?.id}`, JSON.stringify(idList))
}

function handleOrder(rawData: string) {
  const data = JSON.parse(rawData) as Order

  let index = store.rawOrders.findIndex(order => order.imei === data.imei)
  if (index === -1) return console.error('[3un] IMEI 不存在', data)

  if (orderImeis[data.imei]) {
    index = orderImeis[data.imei]
  }

  const resultCol = columns.value[5].key
  const hasResult = resultCol === 'result'

  store.rawOrders[index] = {
    ...store.rawOrders[index],
    ...(hasResult && { result: data.result }),
    ...processOrderResult(data.result),
    status: data.status,
    id: data.id,
    result: data.result,
  }
}

function handleCount() {
  count = count - 1

  if (count === 0) {
    disabled.value = false
    return close()
  }
}

function handleExport() {
  const ids = store.rawOrders.map((item) => item.id).filter(item => item !== null && item !== undefined)
  if (!store.selectId || !ids?.length) {
    toast.warning(t('query.prompt.importNull'))
    return
  }

  const service = serviceStore.services.get(store.selectId)
  if (!submited.value && !service?.isUnlock) {
    toast.warning(t('query.prompt.exportNotSub'))
    return
  }

  const deleteHeaders = store.serviceCols.filter(item => {
    const name = item.key
    return !store.selectHeaders.includes(name)
  }).map(item => item.key)

  exportLoading.value = true
  const response = orderApi.submitExport({
    serviceId: store.selectId,
    orderIdList: ids,
    excelHead: headers,
    deleteExcelHead: deleteHeaders,
  })

  response.then(({ data }) => downloadURL(data))
  response.finally(() => exportLoading.value = false)
}

async function reset() {
  router.replace({ query: {} })

  imeis.value = []
  store.rawOrders = []
  submited.value = false
  comments.value = ''
  count = 0

  if (selService.value) {
    const key = import.meta.env.VITE_SUBMIT_STORGE
    const id = selService.value.id
    localStorage.removeItem(`${key}_${id}`)
    await orderApi.deleteCacheImei({serviceId: selService.value.id})
  }

  close()
}

async function handleFresh() {
  if (store.rawOrders.length === 0) return toast.warning(t('query.prompt.importNull'))

  pendingOrders = store.rawOrders.map(item => {
    if (item.status === ORDER_STATUS.PROCESSING) {
      return item.id
    }
    return null
  }).filter((item): item is number => item !== null)

  if (pendingOrders.length === 0) return toast.info(t('query.prompt.refreshNone'))
  disabled.value = false
  const data = await getSubmitOrderList(pendingOrders)
  toast.success(t('submit.success', { action: t('button.fresh') }))

  for (let item of data) {
    const index = store.rawOrders.findIndex(order => order.id === item.id)

    if (index === -1) continue

    store.rawOrders[index] = {
      ...store.rawOrders[index],
      ...(processOrderResult(item.result)),
      status: item.status,
    }
  }
  disabled.value = true
}

function resetOrder(status: ORDER_STATUS) {
  if (count > 0) return toast.warning(t('query.prompt.orderHandle'))
  if (reseted.value) return toast.warning(t('query.prompt.reseted'))

  submited.value = false
  const data = store.rawOrders.filter(item => item.status === status)
  const dataImeis = [...new Set(data.map(item => item.imei))]

  if (dataImeis.length > 0) {
    reseted.value = true
  }
  reseted.value = true

  for (let imei of dataImeis) {
    const indexes = store.rawOrders
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => item.imei === imei)
      .map(({ idx }) => idx)

    for (let index of indexes) {
      const order = store.rawOrders[index]

      if (order.status !== status) continue

      store.rawOrders[index] = {
        ...store.rawOrders[index],
        status: ORDER_STATUS.WAIT,
        submitedStatus: ASYNC_ORDER_STATUS.WAIT,
        result: "",
      }

      for (let column of serviceColumns.value) {
        const label = isEn.value ? column.nameEn : column.name
        if (label === null) continue

        (store.rawOrders[index] as any)[label] = ""
      }

      orderImeis[imei] = index

      break
    }
  }

  imeis.value = Object.keys(orderImeis.value)
}

function resetNotCoverOrder(status: ORDER_STATUS) {
  if (reseted.value) return toast.warning(t('query.prompt.reseted'))
  submited.value = false
  const data = store.rawOrders.filter(item => item.status === status)
  imeis.value = [...new Set(data.map(item => item.imei))]
  reseted.value = true
  handleImport(imeis.value, "")
}

function resetSelectRow() {
  if (count > 0) return toast.warning(t("query.prompt.orderHandle"))
  if (submitLoading.value) return toast.warning(t("query.prompt.orderHandle"))
  if (indexes.length === 0) {
    return toast.warning(t("query.fields.prompt.noSelectRow"))
  }

  orderImeis = {}
  submited.value = false
  for (let index of indexes) {
    const arrIndex = index - 1
    const order = store.rawOrders[arrIndex]
    orderImeis[order.imei] = arrIndex

    store.rawOrders[arrIndex] = {
      ...store.rawOrders[arrIndex],
      status: ORDER_STATUS.WAIT,
      submitedStatus: ASYNC_ORDER_STATUS.WAIT,
      result: "",
    }

    for (let column of serviceColumns.value) {
      const label = isEn.value ? column.nameEn : column.name
      if (label === null) continue
      (store.rawOrders[arrIndex] as any)[label] = ""
    }
  }

  imeis.value = Object.keys(orderImeis.value)
}

async function handleMustRead() {
  const result = await xconfirm({
    title: t('query.service'),
    text: mustRead.value || '',
    confirmText: t('button.confirm'),
    cancelText: undefined,
  })

  if (!result) pushMsg.value = true
}

async function handlePushMsgChange(value: boolean) {
  if (value) return

  const result = await xconfirm`
    ${t('query.prompt.pushRes')}
  `
  if (!result) pushMsg.value = true
}

function handleDeleteHeader(column: XTableColumn) {
  const headerIndex = store.selectHeaders.findIndex(item => item === column.key.toString())
  const columnIndex = columns.value.findIndex(c => c.key === column.key)
  if (headerIndex !== -1) {
    store.selectHeaders.splice(headerIndex, 1)
  }
  
  if (columnIndex !== -1) {
    columns.value = columns.value.filter(c => c.key !== column.key)
    deletedColumns.push(column)
  } else {
    deletedColumns = deletedColumns.filter(c => c.key !== column.key)
  }

  processResultColumns()
}

function processResultColumns() {
  const deleteKeys = deletedColumns.map(c => c.key)
  const isAllServiceColsDel = headers.every(c => deleteKeys.includes(c))
  const resultCol = getDefaultResultColumns(t)
  
  const index = columns.value.findIndex(c => c.key === resultCol.key)
  if (isAllServiceColsDel) {
    if (index === -1) {
      columns.value.push(resultCol)
    }
  } else {
    if (index !== -1) {
      columns.value.splice(index, 1)
    }
  }
}

function processHeaderConfirm(headers: ServiceCols[]) {
  const selectableKeys = store.serviceCols.map(c => c.key.toString())
  const selectedKeys = headers.map(h => h.key.toString())

  const nextColumns: XTableColumn[] = []
  const nextDeleted: XTableColumn[] = []

  for (const col of columns.value) {
    const key = col.key.toString()
    const isSelectable = selectableKeys.includes(key)
    const isSelected = selectedKeys.includes(key)

    if (!isSelectable) {
      nextColumns.push(col)
    } else if (isSelected) {
      nextColumns.push(col)
    } else {
      nextDeleted.push(col)
    }
  }

  for (const col of deletedColumns) {
    const key = col.key.toString()
    if (selectedKeys.includes(key)) {
      nextColumns.push(col)
    } else {
      nextDeleted.push(col)
    }
  }

  columns.value = nextColumns
  deletedColumns.splice(0, deletedColumns.length, ...nextDeleted)

  processResultColumns()
}

// function handleChange() {
//   if (store.rawOrders.length === 0) return
//   store.view = 'preview'
// }

const handleThreadChange = debounce(async () => {
  localStorage.setItem(`${threadKey}_${uStore.info.userId}`, threads.value.toString())
  await serviceApi.setThread(threads.value)
})

onMounted(() => {
  const raw = localStorage.getItem(`${threadKey}_${uStore.info.userId}`)
  if (raw === null) {
    threads.value = 5
    return
  }

  const value = Number(raw)

  let result = 5

  if (Number.isFinite(value)) {
    if (value < 1) result = 1
    else if (value > 20) result = 20
    else result = value
  }

  threads.value = result
})
</script>

<template>
  <div class="p-4 h-full w-full">
    <section class="w-full flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <SelectService v-model="store.selectId" ui-trigger="w-52" @selected="handleSelected" />

        <ImportPlane :selected-id="store.selectId" @submit="handleImport" />

        <ButtonGroup :layouts="['submit', 'export', 'clear']" @submit="handleSubmit" @export="handleExport"
          @clear="reset" />

        <XButton v-if="selService" :label="t('query.result')" color="warning" :disabled="disabled"
          :loading="loading" @click="handleFresh" />
        
        <!-- <XButton label="打印标签" @click="handleChange" /> -->

        <XButton v-show="serviceColumns.length !== 0" variant="outline" :label="t('query.fields.title.filter')"
          color="primary" @click="store.visibleHeaderFilter = true" />

        <XButtonSplit :label="t('button.reset')" :options="btnSplitOpts" @click="resetSelectRow" />

        <XButton v-show="mustRead" variant="outline" :label="t('query.service')" color="warning"
          @click="handleMustRead" />

        <XSwitch v-model="pushMsg" :label="t('query.pushRes')" @change="handlePushMsgChange" />

        <XSwitch v-model="showAll" label="显示全部" v-if="store.selectId" @change="count = 0" />

        <label class="flex items-center space-x-2">
          <XInputNumber v-model="threads" :step="1" :precision="0" :min="1" :max="10" @change="handleThreadChange" />
          <span>提交线程数</span>
        </label>
      </div>

      <XPagination
        v-model="store.page" v-model:limit="store.limit"
        :total="store.rawOrders.length"
        :sizes
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
        ]"
      />
    </section>

    <section class="w-full h-[calc(100%-3rem)]">
      <XTable ref="tableRef" :data="orders" :columns="columns" row-key="id" class="h-full max-w-full border" selection
        selected-key="index" @select-change="indexes = $event" @column-delete="handleDeleteHeader" />
    </section>

    <TableColumnDialog @confirm="processHeaderConfirm" />
  </div>
</template>

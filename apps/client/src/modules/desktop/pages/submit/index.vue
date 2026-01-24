<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import ImportPlane from './components/ImportPlane.vue'
import TableColumnDialog from './components/TableColumnDialog.vue'

import { type XTableExpose, XTag, type XBtnSplitOptions, type XTableColumn } from '@3un/ui'
import { ASYNC_ORDER_STATUS, ASYNC_ORDER_STATUS_MAP, ORDER_STATUS, ORDER_VERIFY } from '@3un/utils'
import { downloadURL, xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'
import { h } from 'vue'

import type { Service, ServiceHeader } from '@/api/services'
import type { Order, OrderTableView, OrderSubmitResult, SubmitOrderListParams } from '@/api/orders'
import { getDefaultColumns } from './utils/columns'
import { serviceApi } from '@/api/services'
import { orderApi, type ServiceColumnItem } from '@/api/orders'
import type { FieldMap } from './utils/types'
import { SUBMIT_STORE, type SubmitStore } from './utils'

interface TheProps {
  id: string
  imei: string
}

const store = reactive<SubmitStore>({
  visibleHeaderFilter: false,
  selectHeaders: [],
  serviceCols: [],
  selectId: 0,
})

provide(SUBMIT_STORE, store)

const props = defineProps<TheProps>()

const uStore = useUserStore()
const serviceStore = useServiceStore()
const { connect, close } = useWsStore()
const { t, locale } = useI18n()

const page = ref(1)
const limit = ref(50)

const rawOrders = ref<OrderTableView[]>([])
const columns = shallowRef<XTableColumn[]>(getDefaultColumns(t))
const pendingOrders = shallowRef<number[]>([])

const submitLoading = ref(false)
const exportLoading = ref(false)
const pushMsg = ref(true)
const disabled = ref(false)
const showAll = ref(false)
const tableRef = ref<XTableExpose | null>(null)

let count = 0
const submited = ref(false)
const imeis = ref<string[]>([])
const comments = ref<string>('')

// const selectedId = ref(+props.id)
const selService = ref<Service>()
const serviceColumns = ref<ServiceColumnItem[]>([])

const orderImeis = ref<Record<string, number>>({})
const reseted = ref<boolean>(false)
const indexes = shallowRef<number[]>([])
// const orders = shallowRef<OrderTableView[]>([])

const sizes = [50, 150, 200, 300, 500]

const threadNum = ref(5) // 线程数

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

let headers: string[] = []

watch(
  () => props.id,
  () => store.selectId = +props.id,
  {
    immediate: true,
  }
)

const orders = computed(() => {
  return rawOrders.value.slice(
    (page.value - 1) * limit.value,
    page.value * limit.value
  )
})

// watch(
//   () => rawOrders.value,
//   () => {
//     orders.value = rawOrders.value.slice(
//       (page.value - 1) * limit.value,
//       page.value * limit.value
//     )
//   }
// )

// Initialize
await Promise.all([
  serviceStore.getServices(),
  // Initialize service fields
  handleSelected(store.selectId),
])

const router = useRouter()

if (props.imei) {
  handleImport([props.imei], '')
}

watch(
  () => showAll.value,
  async () => {
    if (store.selectId) {
      await handleSubmitOrder(store.selectId)
    }
    imeis.value = []
  }
)

async function handleSelected(value: number) {
  if (!value) return
  page.value = 1
  close()

  // handle reselect service
  if (rawOrders.value.length > 0 && imeis.value.length > 0) {
    rawOrders.value = processWaitList(value, imeis.value, comments.value)
    submited.value = false
  }

  count = 0
  disabled.value = false

  selService.value = serviceStore.services.get(value)!

  await handleServiceCols(value)
  handleSubmitOrder(value)
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

  return [
    ...frontCols,
    ...serviceCols,
    ...endCols
  ]
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

async function handleServiceCols(value: number) {
  const { data } = await serviceApi.header(value)

  headers = data.map(item => (locale.value === 'zh' ? item.name : item.nameEn ? item.nameEn : item.name))
  serviceColumns.value = data.map(item => ({ name: item.name, nameEn: item.nameEn }))
  store.serviceCols = data

  store.selectHeaders = headers.map(item => item)

  if (selService.value?.isUnlock) {
    columns.value = asyncServiceMergeColumns(generateColumns(data))
  } else {
    columns.value = mergeColumns(generateColumns(data))
  }
}

function generateColumns(headers: ServiceHeader[]) {
  const columns: XTableColumn[] = []

  const isEn = locale.value === "en"

  for (let item of headers) {
    const label = isEn ? item.nameEn : item.name
    columns.push({
      key: label,
      title: label,
      minWidth: item.width,
      isColDel: true,
      isFilter: true,
      isDrag: true,
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

function handleImport(imeiList: string[], remark: string) {
  if (count > 0 && !selService.value?.isUnlock) return
  page.value = 1
  tableRef.value?.initFilter()
  close()
  const submitedOrders = processWaitList(store.selectId, imeiList, remark)
  rawOrders.value.splice(0, 0, ...submitedOrders)
  submited.value = false
  imeis.value = imeiList
  comments.value = remark
  count = imeiList.length
}

function processWaitList(id: number, imeiList: string[], remark: string) {
  const service = serviceStore.services.get(id)
  const buckets: OrderTableView[] = []
  const isEn = locale.value === "en"

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
      const name = isEn ? item.nameEn : item.name
      initData[name!] = ""
    })

    buckets.push(initData)
    // buckets.push({
    //   ...serviceColumns.value.map(item => { (isEn ? item.nameEn : item.name): "" })
    // })
  }

  return buckets
}

function handleSubmit() {
  if (submitLoading.value) return

  const submitOrders = rawOrders.value.map(item => {
    if (item.status === ORDER_STATUS.WAIT) {

      return item
    }
    return null
  }).filter(Boolean)

  if (submited.value || submitOrders.length === 0) return toast.warning(t('query.prompt.repeat'))
  const service = serviceStore.services.get(store.selectId)

  if (!service) return toast.warning(t('query.prompt.serviveNull'))
  if (orders.value.length === 0) return toast.warning(t('query.prompt.importNull'))
  submitLoading.value = true

  if (count === 0) {
    count = imeis.value.length
  }

  disabled.value = true

  if (service.isUnlock) return submitOrder(service)
  submitQueryOrder(service)
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

    pendingOrders.value = data
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

function renderSubmitOrderResult(data: OrderSubmitResult[]) {
  const errMsgCol = headers[0]

  for (let item of data) {
    let index = rawOrders.value.findIndex(order => order.imei === item.imei)
    const keys = Object.keys(orderImeis.value)
    if (keys.includes(item.imei)) {
      index = orderImeis.value[item.imei]
    }

    if (index === -1) return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, item)

    const isFailed = item.status === ORDER_STATUS.FAILED
    if (isFailed) handleCount()

    rawOrders.value[index] = {
      ...rawOrders.value[index],
      ...({ [errMsgCol]: item.message }),
      result: item.message,
      status: item.status,
      submitedStatus: item.status === ORDER_STATUS.FAILED ? ASYNC_ORDER_STATUS.ASYNC_FAILED : undefined,
      id: item.codeId,
    }
  }

  const key = import.meta.env.VITE_SUBMIT_STORGE
  const service = serviceStore.services.get(store.selectId)
  let idList = data.map(item => item.codeId).filter((x): x is number => x !== null)
  if (imeis.value && !showAll.value) {
    idList = rawOrders.value.map(item => item.id).filter((x): x is number => x !== null)
  }
  localStorage.setItem(`${key}_${service?.id}`, JSON.stringify(idList))
}

function handleOrder(rawData: string) {
  const data = JSON.parse(rawData) as Order

  let index = rawOrders.value.findIndex(order => order.imei === data.imei)
  if (index === -1) return console.error('[3un] IMEI 不存在', data)

  if (orderImeis.value[data.imei]) {
    index = orderImeis.value[data.imei]
  }

  const resultCol = columns.value[5].key
  const hasResult = resultCol === 'result'

  rawOrders.value[index] = {
    ...rawOrders.value[index],
    ...(hasResult && { result: data.result }),
    ...processOrderResult(data.result),
    status: data.status,
    id: data.id,
    result: data.result,
  }
}

function processOrderResult(content: string) {
  const result: Record<string, string> = {}
  const items = content.split('<br>')

  const keyMap = getFieldsMap(serviceColumns.value)

  const lang = locale.value
  const isEn = lang.startsWith("en")

  if (items.length === 1 && serviceColumns.value.length === 1) {
    const key = isEn ? (serviceColumns.value[0].nameEn ?? serviceColumns.value[0].name) : serviceColumns.value[0].name
    result[key] = content
  } else {
    for (const item of items) {
      const [key, ...valueParts] = item.split(/[:：]/)
      const rawKey = key.trim()
      const value = valueParts.join(":").trim()

      const mapped = keyMap[rawKey]
      if (!mapped) continue

      const finalKey = isEn ? mapped.en ? mapped.en : mapped.cn : mapped.cn
      result[finalKey] = value
    }
  }

  const isSuccess = judgeOrderStatus(serviceColumns.value, items)

  if (!isSuccess) {
    result[headers[0]] = content
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

function handleCount() {
  count = count - 1

  if (count === 0) {
    disabled.value = false
    return close()
  }
}

function handleExport() {
  const ids = rawOrders.value.map((item) => item.id).filter(item => item !== null && item !== undefined)
  if (!store.selectId || !ids?.length) {
    toast.warning(t('query.prompt.importNull'))
    return
  }

  const service = serviceStore.services.get(store.selectId)
  if (!submited.value && !service?.isUnlock) {
    toast.warning(t('query.prompt.exportNotSub'))
    return
  }

  const isEn = locale.value === "en"

  const deleteHeaders = store.serviceCols.filter(item => {
    const name = isEn ? item.nameEn : item.name
    return !store.selectHeaders.includes(name)
  }).map(item => isEn ? item.nameEn : item.name)

  exportLoading.value = true
  const response = orderApi.submitExport({
    serviceId: store.selectId,
    // imeiList: imeis.value,
    orderIdList: ids,
    excelHead: headers,
    deleteExcelHead: deleteHeaders,
  })

  response.then(({ data }) => downloadURL(data))
  response.finally(() => exportLoading.value = false)
}

function reset() {
  router.replace({ query: {} })

  imeis.value = []
  rawOrders.value = []
  submited.value = false
  comments.value = ''
  count = 0

  if (selService.value) {
    const key = import.meta.env.VITE_SUBMIT_STORGE
    const id = selService.value.id
    localStorage.removeItem(`${key}_${id}`)
  }
  close()
}

const mustRead = computed(() => {
  const service = serviceStore.services.get(store.selectId)
  return service ? service.mustRead : null
})

async function handlePushMsgChange(value: boolean) {
  if (value) return

  const result = await xconfirm`
    ${t('query.prompt.pushRes')}
  `
  if (!result) pushMsg.value = true
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

function resetOrder(status: ORDER_STATUS) {
  if (count > 0) return toast.warning(t('query.prompt.orderHandle'))
  if (reseted.value) return toast.warning(t('query.prompt.reseted'))

  submited.value = false
  const data = rawOrders.value.filter(item => item.status === status)
  const dataImeis = [...new Set(data.map(item => item.imei))]
  const isEn = locale.value === "en"

  if (dataImeis.length > 0) {
    reseted.value = true
  }
  reseted.value = true

  for (let imei of dataImeis) {
    const indexes = rawOrders.value
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => item.imei === imei)
      .map(({ idx }) => idx)

    for (let index of indexes) {
      const order = rawOrders.value[index]

      if (order.status !== status) continue

      rawOrders.value[index] = {
        ...rawOrders.value[index],
        status: ORDER_STATUS.WAIT,
        submitedStatus: ASYNC_ORDER_STATUS.WAIT,
        result: "",
      }

      for (let column of serviceColumns.value) {
        const label = isEn ? column.nameEn : column.name
        if (label === null) continue

        (rawOrders.value[index] as any)[label] = ""
      }

      orderImeis.value[imei] = index

      break
    }
  }

  imeis.value = Object.keys(orderImeis.value)
}

function resetNotCoverOrder(status: ORDER_STATUS) {
  if (reseted.value) return toast.warning(t('query.prompt.reseted'))
  submited.value = false
  const data = rawOrders.value.filter(item => item.status === status)
  imeis.value = [...new Set(data.map(item => item.imei))]
  reseted.value = true
  handleImport(imeis.value, "")
}

async function handleSubmitOrder(id: number) {
  const key = import.meta.env.VITE_SUBMIT_STORGE
  const jsonStr = localStorage.getItem(`${key}_${id}`)

  const idList = (jsonStr && !showAll.value) ? JSON.parse(jsonStr) as number[] : []

  const data = await getSubmitOrderList(idList)

  submited.value = true

  rawOrders.value = data.map((item, i) => ({
    ...item,
    ...(processOrderResult(item.result)),
    index: i + 1,
  }))

  pendingOrders.value = data.map(item => {
    if (item.status === ORDER_STATUS.PROCESSING) {
      return item.id
    }
    return null
  }).filter((item): item is number => item !== null)
}

async function getSubmitOrderList(orderIds: number[]) {
  const params: SubmitOrderListParams = {
    serviceId: store.selectId,
    codeIdList: orderIds,
    showAll: showAll.value,
  }
  const { data } = await orderApi.submitOrders(params)

  setTimeout(() => {
    disabled.value = false
  }, 1500)

  return data
}

async function handleFresh() {
  if (rawOrders.value.length === 0) return toast.warning(t('query.prompt.importNull'))

  pendingOrders.value = rawOrders.value.map(item => {
    if (item.status === ORDER_STATUS.PROCESSING) {
      return item.id
    }
    return null
  }).filter((item): item is number => item !== null)

  if (pendingOrders.value.length === 0) return toast.info(t('query.prompt.refreshNone'))
  disabled.value = false
  const data = await getSubmitOrderList(pendingOrders.value)
  toast.success(t('submit.success', { action: t('button.fresh') }))

  for (let item of data) {
    const index = rawOrders.value.findIndex(order => order.id === item.id)

    if (index === -1) continue

    rawOrders.value[index] = {
      ...rawOrders.value[index],
      ...(processOrderResult(item.result)),
      status: item.status,
    }
  }
  disabled.value = true
}

function processHeaderConfirm(data: ServiceHeader[]) {
  if (selService.value?.isUnlock) {
    columns.value = asyncServiceMergeColumns(generateColumns(data))
  } else {
    columns.value = mergeColumns(generateColumns(data))
  }
}

function handleDeleteHeader(column: string | number | Symbol | (string & {})) {
  const isEn = locale.value === "en"
  const index = store.selectHeaders.findIndex(item => item === column.toString())
  if (index !== -1) {
    store.selectHeaders.splice(index, 1)
  }

  const headers = store.serviceCols.filter(item => {
    const name = isEn ? item.nameEn : item.name
    return store.selectHeaders.includes(name)
  })

  processHeaderConfirm(headers)
}

function resetSelectRow() {
  if (count > 0) return toast.warning(t("query.prompt.orderHandle"))
  if (submitLoading.value) return toast.warning(t("query.prompt.orderHandle"))
  if (indexes.value.length === 0) {
    return toast.warning(t("query.fields.prompt.noSelectRow"))
  }

  const isEn = locale.value === "en"
  orderImeis.value = {}
  submited.value = false
  for (let index of indexes.value) {
    const arrIndex = index - 1
    const order = rawOrders.value[arrIndex]
    orderImeis.value[order.imei] = arrIndex

    console.log(orderImeis)
    rawOrders.value[arrIndex] = {
      ...rawOrders.value[arrIndex],
      status: ORDER_STATUS.WAIT,
      submitedStatus: ASYNC_ORDER_STATUS.WAIT,
      result: "",
    }

    for (let column of serviceColumns.value) {
      const label = isEn ? column.nameEn : column.name
      if (label === null) continue
      (rawOrders.value[arrIndex] as any)[label] = ""
    }
  }

  imeis.value = Object.keys(orderImeis.value)
}


/** 切换线程 */
let timer: number | null = null

watch(() => threadNum.value, (newVal) => {
  if (timer) clearTimeout(timer)
  timer = window.setTimeout(async () => {
    await serviceApi.getThread(newVal)

    localStorage.setItem(`USER_ID_THREADNUM_${uStore.info.userId}`, `${newVal}`)
  }, 300)
})

const isThreadNum = computed(() => orders.value.some(item => item.status === 4))


onMounted(() => {
  const userID = localStorage.getItem(`USER_ID_THREADNUM_${uStore.info.userId}`)
  threadNum.value = Number(userID) ? Number(userID) : 5
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

        <XButton v-if="selService?.isUnlock" :label="t('query.result')" color="warning" :disabled="disabled"
          :icon="disabled ? 'svg-spinners:bars-rotate-fade' : ''" @click="handleFresh" />

        <XButton v-show="serviceColumns.length !== 0" variant="outline" :label="t('query.fields.title.filter')"
          color="primary" @click="store.visibleHeaderFilter = true" />

        <XButtonSplit :label="t('button.reset')" :options="btnSplitOpts" @click="resetSelectRow" />

        <XButton v-show="mustRead" variant="outline" :label="t('query.service')" color="warning"
          @click="handleMustRead" />

        <XSwitch v-model="pushMsg" :label="t('query.pushRes')" @change="handlePushMsgChange" />

        <XSwitch v-model="showAll" label="显示全部" v-if="store.selectId" @change="count = 0" />

        <section class="flex justify-center items-center space-x-2">
          <input v-model.number="threadNum" type="number" :disabled="isThreadNum"
            class="w-14 h-7 rounded border pl-2 border-border select-none" min="1" max="10" @keydown.prevent
            @wheel.prevent>
          <div class="text-sm text-gray-500">线程</div>
        </section>
      </div>

      <XPagination v-model="page" v-model:limit="limit" :total="rawOrders.length" :sizes :layouts="[
        'total',
        'prev',
        'pager',
        'next',
        'sizes',
      ]" />
    </section>

    <section class="w-full h-[calc(100%-3rem)]">
      <!-- selection selected-key="id" -->
      <XTable ref="tableRef" :data="orders" :columns="columns" row-key="id" class="h-full max-w-full border" selection
        selected-key="index" @select-change="indexes = $event" @column-delete="handleDeleteHeader" />
    </section>

    <TableColumnDialog @confirm="processHeaderConfirm" />
  </div>
</template>

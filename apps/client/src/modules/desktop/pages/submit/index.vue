<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import ImportPlane from './components/ImportPlane.vue'

import { XTag, type XTableColumn } from '@3un/ui'
import { ASYNC_ORDER_STATUS, ASYNC_ORDER_STATUS_MAP, ORDER_STATUS, ORDER_VERIFY } from '@3un/utils'
import { downloadURL, xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'
import { h } from 'vue'

import type { Service } from '@/api/services'
import type { Order, OrderTableView, OrderSubmitResult, SubmitOrderListParams } from '@/api/orders'
import { getDefaultColumns } from './utils/columns'
import { serviceApi } from '@/api/services'
import { orderApi, type ServiceColumnItem } from '@/api/orders'
import type { FieldMap } from './utils/types'

interface TheProps {
  id: string
  imei: string
}

const props = defineProps<TheProps>()

const uStore = useUserStore()
const store = useServiceStore()
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

let count = 0
const submited = ref(false)
const imeis = ref<string[]>([])
const comments = ref<string>('')

const selectedId = ref(+props.id)
const headers = shallowRef<string[]>([])
const selService = ref<Service>()
const serviceColumns = ref<ServiceColumnItem[]>([])

const sizes = [50, 150, 200, 300, 500]

const orders = computed(() => {
  return rawOrders.value.slice(
    (page.value - 1) * limit.value,
    page.value * limit.value
  )
})

// Initialize
await Promise.all([
  store.getServices(),
  // Initialize service fields
  handleSelected(selectedId.value),
])

const router = useRouter()

if (props.imei) {
  handleImport([props.imei], '')
}

watch(
  () => showAll.value,
  async() => {
    if(selectedId.value) {
      await handleSubmitOrder(selectedId.value)
    } 
  }
)

async function handleSelected(value: number) {
  if (!value) return

  // handle reselect service
  if (rawOrders.value.length > 0 && imeis.value.length > 0) {
    rawOrders.value = processWaitList(value, imeis.value, comments.value)
    submited.value = false
  }

  count = 0
  disabled.value = false

  selService.value = store.services.get(value)!

  await handleServiceCols(value)
  handleSubmitOrder(value)
}

function mergeColumns(serviceCols: XTableColumn[]): XTableColumn[] {
  const defaultCols = getDefaultColumns(t)
  const len = defaultCols.length
  const frontCols = defaultCols.slice(0, len - 2)
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
        if(!value) {
          status = ASYNC_ORDER_STATUS_MAP[ASYNC_ORDER_STATUS.ASYNC_SUBMITED]
  
          if(row.status === ORDER_STATUS.WAIT) {
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

  headers.value = data.map(item => (locale.value === 'zh' ? item.name : item.nameEn ? item.nameEn : item.name))
  serviceColumns.value = data.map(item => ({ name: item.name, nameEn: item.nameEn }))
  
  const serviceCols: XTableColumn[] = []

  if (data.length === 0) {
    if(selService.value?.isUnlock) {
      columns.value = asyncServiceMergeColumns(serviceCols)
    } else {
      columns.value = getDefaultColumns(t)
    }
    return
  }

  for (const item of data) {
    const { name, nameEn, width } = item
    const field = locale.value === 'zh' ? name : nameEn ? nameEn : name 
    serviceCols.push({
      key: field,
      title: locale.value === 'zh' ? name : nameEn ? nameEn : name,
      minWidth: width,
      tdClassName: 'leading-6 py-1',
      render: (_: any, row: any) => {
        return h('span', { innerHTML: row[field] })
      }
    })
  }

  if(selService.value?.isUnlock) {
    columns.value = asyncServiceMergeColumns(serviceCols)
  }
  else {
    columns.value = mergeColumns(serviceCols)
  }
}

function handleImport(imeiList: string[], remark: string) {
  if(count > 0 && !selService.value?.isUnlock) return
  close()
  const submitedOrders = processWaitList(selectedId.value, imeiList, remark)
  rawOrders.value.splice(0, 0, ...submitedOrders)
  submited.value = false
  imeis.value = imeiList
  comments.value = remark
  count = imeiList.length
}

function processWaitList(id: number, imeiList: string[], remark: string) {
  const service = store.services.get(id)
  const buckets: OrderTableView[] = []

  for (let i = 0; i < imeiList.length; i++) {
    buckets.push({
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
    })
  }

  return buckets
}

function handleSubmit() {
  if(submitLoading.value) return

  const submitOrders = rawOrders.value.map(item => {
    if(item.status === ORDER_STATUS.WAIT) {
      return item
    }
    return null
  }).filter(Boolean)

  if (submited.value  || submitOrders.length === 0) return toast.warning(t('query.prompt.repeat'))
  const service = store.services.get(selectedId.value)

  if (!service) return toast.warning(t('query.prompt.serviveNull'))
  if (orders.value.length === 0) return toast.warning(t('query.prompt.importNull'))
  submitLoading.value = true

  if(count === 0) {
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
    uStore.updateCredit()
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
    store.addRecentService(service.id)

    if (service.isUnlock) {
      toast.success(`${t('submit.success', { action: t('action.submit') })}`)
      disabled.value = false
    }

    pendingOrders.value = data
      .map(item => item.status === ORDER_STATUS.PROCESSING ? item.codeId : null)
      .filter((x): x is number => x !== null)

    renderSubmitOrderResult(data)
  })

  response.catch((err) => {
    console.error(`[3un] ${t('submit.fail', { action: t('query.submit') })}`, err)
    submited.value = false
    close()
  })

  response.finally(() => {
    submitLoading.value = false
  })
}

function renderSubmitOrderResult(data: OrderSubmitResult[]) {
  const errMsgCol = headers.value[0]
  // const result: OrderTableView[] = []

  // let text = "提交成功, 请前往<a href='/history' class='underline hover:text-success'>订单历史</a>查看结果"
  // if(locale.value !== 'zh') {
  //   text = "Submission successful. Please go to <a href='/history' class='underline hover:text-success'>History</a> to view the result."
  // }

  for (let item of data) {
    const index = imeis.value.indexOf(item.imei)
    if (index === -1) return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, item)

    const isFailed = item.status === ORDER_STATUS.FAILED
    if (isFailed) handleCount()

    rawOrders.value[index] = {
      ...rawOrders.value[index],
      // ...({ [errMsgCol]: item.message ? item.message : service?.isUnlock ? text : item.message }),
      ...({ [errMsgCol]: item.message }),
      result: item.message,
      status: item.status,
      submitedStatus: item.status === ORDER_STATUS.FAILED ? ASYNC_ORDER_STATUS.ASYNC_FAILED : undefined,
      id: item.codeId,
    }

    // result.push({
    //   ...rawOrders.value[index],
    //   ...({ [errMsgCol]: item.message ? item.message : service?.isUnlock ? text : item.message }),
    //   ...({ [errMsgCol]: item.message }),
    //   result: item.message,
    //   status: item.status,
    //   id: item.codeId,
    // })
  }

  const key = import.meta.env.VITE_SUBMIT_STORGE
  const service = store.services.get(selectedId.value)
  let idList = data.map(item => item.codeId).filter((x): x is number => x !== null)
  if(imeis.value && !showAll.value) {
    idList = rawOrders.value.map(item => item.id).filter((x): x is number => x !== null)
  }
  localStorage.setItem(`${key}_${service?.id}`, JSON.stringify(idList))

  // rawOrders.value = result
}

function handleOrder(rawData: string) {
  const data = JSON.parse(rawData) as Order

  const index = imeis.value.indexOf(data.imei)
  if (index === -1) return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, data)
  const codeId = data.id
  const codeIndex = pendingOrders.value.indexOf(codeId)
  if(codeIndex === -1) return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, data)
  pendingOrders.value.splice(codeIndex, 1)

  const resultCol = columns.value[5].key
  const hasResult = resultCol === 'result'

  rawOrders.value[index] = {
    ...rawOrders.value[index],
    ...(hasResult && { result: data.result }),
    ...(!hasResult && processOrderResult(data.result)),
    status: data.status,
    id: data.id
  }
}

function processOrderResult(content: string) {
  const result: Record<string, string> = {}
  const items = content.split('<br>')
  
  const keyMap = getFieldsMap(serviceColumns.value)
  
  const lang = locale.value
  const isEn = lang.startsWith("en")
  
  if(items.length === 1 && serviceColumns.value.length === 1) {
    const key = isEn ? (serviceColumns.value[0].nameEn ?? serviceColumns.value[0].name) : serviceColumns.value[0].name
    result[key] = content
  } else {
    for(const item of items) {
      const [key, ...valueParts] = item.split(/[:：]/)
      const rawKey = key.trim()
      const value = valueParts.join(":").trim()
      
      const mapped = keyMap[rawKey]
      if(!mapped) continue
      
      const finalKey = isEn ? (mapped.en ?? mapped.cn ) : mapped.cn
      result[finalKey] = value
    }
  }
  
  const isSuccess = judgeOrderStatus(serviceColumns.value, items)

  if(!isSuccess) {
    result[headers.value[0]] = content
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

  for(let i = 0; i < fieldsCN.length; i++) {
    const cn = fieldsCN[i]
    const en = fieldsEN[i]

    result[cn] = { cn, en }

    if(en !== null && en !== "") {
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
  if (!selectedId.value || !ids?.length) {
    toast.warning(t('query.prompt.importNull'))
    return
  }

  const service = store.services.get(selectedId.value)
  if (!submited.value && !service?.isUnlock) {
    toast.warning(t('query.prompt.exportNotSub'))
    return
  }

  exportLoading.value = true
  const response = orderApi.submitExport({
    serviceId: selectedId.value,
    // imeiList: imeis.value,
    orderIdList: ids,
    excelHead: headers.value,
  })

  response.then(({ data }) => downloadURL(data))
  response.finally(() => exportLoading.value = false)
}

function reset() {
  router.replace({query: {}})

  imeis.value = []
  rawOrders.value = []
  submited.value = false
  comments.value = ''
  count = 0

  if(selService.value) {
    const key = import.meta.env.VITE_SUBMIT_STORGE
    const id = selService.value.id
    localStorage.removeItem(`${key}_${id}`)
  }
  close()
}

const mustRead = computed(() => {
  const service = store.services.get(selectedId.value)
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

async function handleSubmitOrder(id: number) {
  const key = import.meta.env.VITE_SUBMIT_STORGE
  const jsonStr = localStorage.getItem(`${key}_${id}`)

  const idList = (jsonStr && !showAll.value) ? JSON.parse(jsonStr) as number[] : []

  if(idList.length === 0) showAll.value = true

  const data = await getSubmitOrderList(idList)

  submited.value = true

  rawOrders.value = data.map((item, i) => ({
    ...item,
    ...(processOrderResult(item.result)),
    index: i + 1,
  }))

  pendingOrders.value = data.map(item => {
    if(item.status === ORDER_STATUS.PROCESSING) {
      return item.id
    }
    return null
  }).filter((item): item is number => item !== null)
}

async function getSubmitOrderList(orderIds: number[]) {
  const params: SubmitOrderListParams = {
    serviceId: selService.value!.id,
    codeIdList: orderIds,
  }
  const { data } = await orderApi.submitOrders(params)

  setTimeout(() => {
    disabled.value = false
  }, 1500)

  return data
}

async function handleFresh() {
  if(rawOrders.value.length === 0) return toast.warning(t('query.prompt.importNull'))
  
  pendingOrders.value = rawOrders.value.map(item => {
    if(item.status === ORDER_STATUS.PROCESSING) {
      return item.id
    }
    return null
  }).filter((item): item is number => item !== null)
  
  if(pendingOrders.value.length === 0) return toast.info(t('query.prompt.refreshNone'))
  disabled.value = false
  const data = await getSubmitOrderList(pendingOrders.value)
  toast.success(t('submit.success', { action: t('button.fresh') }))

  for(let item of data) {
    const index = rawOrders.value.findIndex(order => order.id === item.id)

    if(index === -1) continue

    rawOrders.value[index] = {
      ...rawOrders.value[index],
      ...(processOrderResult(item.result)),
      status: item.status,
    }
  }
  disabled.value = true
}
</script>

<template>
  <div class="p-4 h-full w-full">
    <section class="w-full flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <SelectService
          v-model="selectedId"
          ui-trigger="w-52"
          @selected="handleSelected"
        />

        <ImportPlane
          :selected-id="selectedId"
          @submit="handleImport"
        />

        <ButtonGroup
          :layouts="['submit', 'export', 'clear']"
          @submit="handleSubmit" @export="handleExport" @clear="reset"
        />

        <XButton
          v-if="selService?.isUnlock"
          variant="outline"
          :label="t('query.result')" color="success"
          :disabled="disabled"
          :icon="disabled ? 'svg-spinners:bars-rotate-fade' : ''"
          @click="handleFresh"
        />

        <XButton
          v-show="mustRead" variant="outline"
          :label="t('query.service')" color="warning"
          @click="handleMustRead"
        />

        <XSwitch
          v-model="pushMsg" :label="t('query.pushRes')"
          @change="handlePushMsgChange"
        />

        <XSwitch
          v-model="showAll" label="显示全部"
          v-if="selectedId"
        />
      </div>

      <XPagination
        v-model="page"
        v-model:limit="limit"
        :total="rawOrders.length"
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
      <XTable
        :data="orders"
        :columns="columns"
        row-key="index"
        class="h-full max-w-full border"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import ImportPlane from './components/ImportPlane.vue'

import type { XTableColumn } from '@3un/ui'
import { ORDER_STATUS, ORDER_VERIFY } from '@3un/utils'
import { downloadURL } from '@3un/utils'
import { toast } from 'vue-sonner'
import { hash } from 'ohash'
import { h } from 'vue'

import type { Service } from '@/api/services'
import type { Order, OrderTableView, OrderSubmitResult } from '@/api/orders'
import { getDefaultColumns } from './utils/columns'
import { serviceApi } from '@/api/services'
import { orderApi } from '@/api/orders'
import { xconfirm } from '@3un/utils'

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

const submitLoading = ref(false)
const exportLoading = ref(false)
const pushMsg = ref(true)

let count = 0
const submited = ref(false)
const imeis = ref<string[]>([])
const comments = ref<string>('')

const selectedId = ref(+props.id)
const headers = shallowRef<string[]>([])

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

async function handleSelected(value: number) {
  if (!value) return

  // handle reselect service
  if (rawOrders.value.length > 0 && imeis.value.length > 0) {
    rawOrders.value = processWaitList(value, imeis.value, comments.value)
    submited.value = false
  }

  await handleServiceCols(value)
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

async function handleServiceCols(value: number) {
  const { data } = await serviceApi.header(value)

  headers.value = data.map(item => (locale.value === 'zh' ? item.name : item.nameEn ? item.nameEn : item.name))

  if (data.length === 0) {
    columns.value = getDefaultColumns(t)
    return
  }

  const serviceCols: XTableColumn[] = []
  for (const item of data) {
    const { name, nameEn, width } = item

    const field = hash(locale.value === 'zh' ? name : nameEn ? nameEn : name)

    serviceCols.push({
      key: field,
      title: locale.value === 'zh' ? name : nameEn ? nameEn : name,
      width: width,
      tdClassName: 'leading-6 py-1',
      render: (_: any, row: any) => {
        return h('span', { innerHTML: row[field] })
      }
    })
  }

  columns.value = mergeColumns(serviceCols)
}

function handleImport(imeiList: string[], remark: string) {
  rawOrders.value = processWaitList(selectedId.value, imeiList, remark)
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
  if (submited.value) return toast.warning(t('query.prompt.repeat'))
  const service = store.services.get(selectedId.value)

  if (!service) return toast.warning(t('query.prompt.serviveNull'))
  if (orders.value.length === 0) return toast.warning(t('query.prompt.importNull'))
  submitLoading.value = true

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
  response.then(({ data }) => {
    store.addRecentService(service.id)

    if (service.isUnlock) {
      toast.success(`${t('submit.success', { action: t('action.submit') })}}`)
    }

    renderSubmitOrderResult(data)
  })

  response.catch((err) => {
    console.error(`[3un] ${t('submit.fail', { action: t('query.submit') })}`, err)
    close()
  })

  response.finally(() => {
    submitLoading.value = false
  })
}

function renderSubmitOrderResult(data: OrderSubmitResult[]) {
  const errMsgCol = columns.value[5].key
  const result = []

  for (let item of data) {
    const index = imeis.value.indexOf(item.imei)
    if (index === -1) return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, item)

    const isFailed = item.status === ORDER_STATUS.FAILED
    if (isFailed) handleCount()

    result.push({
      ...rawOrders.value[index],
      ...(isFailed && { [errMsgCol]: item.message }),
      status: item.status,
    })
  }

  rawOrders.value = result
}

function handleOrder(rawData: string) {
  const data = JSON.parse(rawData) as Order

  const index = imeis.value.indexOf(data.imei)
  if (index === -1) return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, data)

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

  for (const item of items) {
    const [key, ...value] = item.split(/[:：]/)
    result[hash(key.trim())] = value.join(':').trim()
  }

  return result
}

async function handleCount() {
  count = count - 1

  if (count === 0) {
    submited.value = true
    return close()
  }
}

function handleExport() {
  const ids = rawOrders.value.map((item) => item.id)
  if (!selectedId.value || !ids?.length) {
    toast.warning(t('query.prompt.importNull'))
    return
  }

  if (!submited.value) {
    toast.warning(t('query.prompt.exportNotSub'))
    return
  }

  exportLoading.value = true
  const response = orderApi.submitExport({
    serviceId: selectedId.value,
    imeiList: imeis.value,
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
</script>

<template>
  <div class="p-4 h-full w-full">
    <section class=" w-full flex items-center justify-between mb-3">
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
          v-show="mustRead" variant="outline"
          :label="t('query.service')" color="warning"
          @click="handleMustRead"
        />

        <XSwitch
          v-model="pushMsg" :label="t('query.pushRes')"
          @change="handlePushMsgChange"
        />
      </div>

      <XPagination
        v-model="page"
        v-model:limit="limit"
        :total="rawOrders.length"
        :sizes
        :layouts="[
          'total',
          'sizes',
          'prev',
          'pager',
          'next',
        ]"
      />
    </section>
  
    <XTable
      :data="orders"
      :columns="columns"
      row-key="index"
      class="h-[calc(100%-3rem)] w-full border"
    />
  </div>
</template>

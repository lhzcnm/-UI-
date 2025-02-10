<script setup lang="ts">
import ImportPlane from './components/ImportPlane.vue'
import Loading from './components/Loading.vue'
import type { ColDef } from 'ag-grid-community'

import { AgGridVue } from 'ag-grid-vue3'
import { toast } from 'vue-sonner'
import { hash } from 'ohash'

import type { ServiceItem } from '@3un/shared/services'
import type { OrderItem, OrderTableView, OrderSubmitResult } from '@3un/shared/orders'

import { theme } from '@/utils/table'
import { ORDER_STATUS, ORDER_VERTIFY, downloadURL } from '@3un/utils'
import { defaultColumns } from './defaultColumns'

import service from '@/api/service'
import orderApi from '@/api/orders'

const route = useRoute()
const store = useServiceStore()
const { connect, close } = useWsStore()

const { id } = route.params
const selectedId = ref(+id)

const page = ref(1)
const pageSize = ref(50)

const rawOrders = shallowRef<OrderTableView[]>([])
const columns = shallowRef<ColDef[]>(defaultColumns)

let count = 0
const submitLoading = ref(false)
const exportLoading = ref(false)
const loadingId = ref<number | string>(0)
const imeis = ref<string[]>([])
const comments = ref<string>('')

const orders = computed(() => {
  return rawOrders.value.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value,
  )
})

// Initialize service fields
await handleSelected(selectedId.value)

function handleImport(imeiList: string[], remark: string) {
  rawOrders.value = processWaitList(selectedId.value, imeiList)
  imeis.value = imeiList
  comments.value = remark
  count = imeiList.length
}

function processWaitList(id: number, imeiList: string[]) {
  const service = store.buckets.get(id)
  const buckets: OrderTableView[] = []

  for (let i = 0; i < imeiList.length; i++) {
    buckets.push({
      index: i + 1,
      id: 0,
      serviceId: service ? service.id : 0,
      serviceTitle: service ? service.title : '请选择服务',
      credit: service ? service.price : 0,
      status: ORDER_STATUS.WAIT,
      verify: ORDER_VERTIFY.NORMAL,
      imei: imeiList[i],
      result: '',
      remark: '',
    })
  }

  return buckets
}

async function handleSelected(value: number) {
  if (!value) return
  if (rawOrders.value.length > 0 && imeis.value.length > 0) {
    rawOrders.value = processWaitList(value, imeis.value)
  }

  const { data } = await service.header(value)
  if (data.length === 0) return

  const serviceCols = data.map((item) => ({
    field: hash(item.name),
    headerName: item.name,
    width: item.width,
  }))

  const len = defaultColumns.length
  const frontCols = defaultColumns.slice(0, len - 2)
  const endCols = defaultColumns.slice(-1)

  columns.value = [
    ...frontCols,
    ...serviceCols,
    ...endCols,
  ] as ColDef[]
}

function handleSubmit() {
  const service = store.buckets.get(selectedId.value)

  if (!service) return toast.warning('请先选择服务')
  if (orders.value.length === 0) return toast.warning('请导入订单')
  submitLoading.value = true

  if (service.isUnlock) return submitOrder(service)
  submitQueryOrder(service)
}

function submitQueryOrder(service: ServiceItem) {
  const { data, status } = connect({ type: 'order' })

  watch(
    status,
    (value) => {
      if (value !== 'OPEN') {
        console.warn('[3un] WebSocket 连接失败', value)
        return
      }
      submitOrder(service)
    },
    { once: true }
  )

  watch(data, (value) => {
    if (!value) return
    if (count === 1) {
      toast.dismiss(loadingId.value)
      sessionStorage.removeItem('submitCount')
      close()
    }

    handleOrder(value)
    sessionStorage.setItem('submitCount', (count - 1).toString())
    count--
  })
}

function submitOrder(service: ServiceItem) {
  const params = {
    groupId: service.parentId,
    serviceId: service!.id,
    imeiList: imeis.value,
    remark: comments.value,
  }

  const response = orderApi.submit(params)
  response.then(({ data }) => {
    if (service.isUnlock) {
      toast.success('提交成功，请稍后前往“我的订单”页面查看')
    }
    else {
      sessionStorage.setItem('submitCount', data.length.toString())
      loadingId.value = toast.custom(
        markRaw(Loading), {
        duration: Infinity,
      })
    }

    renderSubmitOrderResult(data)
  })

  response.finally(() => {
    submitLoading.value = false
  })
}

function renderSubmitOrderResult(data: OrderSubmitResult[]) {
  const errMsgCol = columns.value[6].field!

  // 这里使用 for 循环制造多次渲染更新，
  // 给用户反馈提交进度
  for (let item of data) {
    const index = rawOrders.value.findIndex(order => 
      order.imei === item.imei
    )

    nextTick(() => {
      rawOrders.value[index] = {
        ...rawOrders.value[index],
        status: item.status,
        ...(item.message && {
          [errMsgCol]: item.message
        }),
      }

      triggerRef(rawOrders)
    })
  }
}

function handleOrder(rawData: string) {
  const data = JSON.parse(rawData) as OrderItem

  const index = imeis.value.indexOf(data.imei)
  if (index === -1) return console.warn('[3un] IMEI 不存在', data)

  rawOrders.value[index] = {
    ...rawOrders.value[index],
    ...(data.result && processOrderResult(data.result)),
    status: data.status,
  }
}

function processOrderResult(content: string) {
  const result: Record<string, string> = {}
  const items = content.split('<br>')

  for (const item of items) {
    const [key, value] = item.split(/[:：]/, 2)
    result[hash(key.trim())] = value.trim()
  }

  return result
}

function handleExport() {
  const ids = rawOrders.value.map((item) => item.id)
  if (!selectedId.value || !ids?.length) {
    toast.warning('请选择服务')
    return
  }

  exportLoading.value = true
  const response = orderApi.submitExport(ids)

  response.then(({ data }) => downloadURL(data))
  response.finally(() => exportLoading.value = false)
}

function handleRefresh() {}

function reset() {
  imeis.value = []
  rawOrders.value = []
  comments.value = ''
  count = 0
  close()
}
</script>

<template>
  <div class="h-full">
    <section class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <SelectService v-model="selectedId" @selected="handleSelected" />
        <ImportPlane @submit="handleImport" />
  
        <XButton label="提交" :loading="submitLoading" @click="handleSubmit" />
        <XButton label="刷新" variant="warning" @click="handleRefresh" />
        <XButton label="导出" variant="success" @click="handleExport" />
        <XButton label="清空" variant="danger" @click="reset" />
      </div>

      <XPagination
        v-model="page"
        v-model:size="pageSize"
        :total="rawOrders.length"
        hideOnSinglePage
      />
    </section>
    <AgGridVue
      :theme="theme"
      :rowData="orders"
      :columnDefs="columns"
      class="h-[calc(100%-48px)]"
    />
  </div>
</template>

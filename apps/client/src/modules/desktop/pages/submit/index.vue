<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import ImportPlane from './components/ImportPlane.vue'
import MustRead from './components/MustRead.vue'

import type { ColDef } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'
import { toast } from 'vue-sonner'
import { hash } from 'ohash'

import type { Order, OrderTableView, OrderSubmitResult, OrderSCRP } from '@/api/orders'
import type { Service } from '@/api/services'
import { serviceApi } from '@/api/services'
import { orderApi } from '@/api/orders'

import tableTheme from '@desktop/utils/table'
import { ORDER_STATUS, ORDER_VERTIFY } from '@3un/shared/enums'
import { defaultColumns, columnOpts } from './utils/columns'
import { downloadURL } from '@3un/utils'

const props = defineProps<{ id: string }>()

const uStore = useUserStore()
const store = useServiceStore()
const { connect, close } = useWsStore()

const page = ref(1)
const pageSize = ref(50)

const rawOrders = ref<OrderTableView[]>([])
const columns = shallowRef<ColDef[]>(defaultColumns)

const submitLoading = ref(false)
const exportLoading = ref(false)
const mustReadVisible = ref(false)
const pushMsg = ref(true)

let count = 0
const submited = ref(false)
const imeis = ref<string[]>([])
const comments = ref<string>('')

const selectedId = ref(+props.id)

const orders = computed(() => {
  return rawOrders.value.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value,
  )
})

// Initialize service fields
await handleSelected(selectedId.value)

async function handleSelected(value: number) {
  if (!value) return

  // handle reselect service
  if (rawOrders.value.length > 0 && imeis.value.length > 0) {
    console.log('reselect service', value, imeis.value, comments.value)
    rawOrders.value = processWaitList(value, imeis.value, comments.value)
    submited.value = false
  }

  const { data } = await serviceApi.header(value)
  if (data.length === 0) return

  const serviceCols: ColDef[] = []
  for (const item of data) {
    const { name, width } = item
    const field = hash(name)
    serviceCols.push({
      field: field,
      headerName: name,
      width: width,
      cellClass: 'leading-6 py-1',
      cellRenderer: ({ data }: OrderSCRP) => {
        return data ? (data as any)[field] : '-'
      },
    })
  }

  const len = defaultColumns.length
  const frontCols = defaultColumns.slice(0, len - 2)
  const endCols = defaultColumns.slice(-1)

  columns.value = [
    ...frontCols,
    ...serviceCols,
    ...endCols,
  ] as ColDef[]
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
      verify: ORDER_VERTIFY.NORMAL,
      imei: imeiList[i],
      remark: remark,
      result: '',
      createTime: '',
    })
  }

  return buckets
}

function handleSubmit() {
  if (submited.value) return toast.warning('请勿重复提交')
  const service = store.services.get(selectedId.value)

  if (!service) return toast.warning('请先选择服务')
  if (orders.value.length === 0) return toast.warning('请导入订单')
  submitLoading.value = true

  if (service.isUnlock) return submitOrder(service)
  submitQueryOrder(service)
}

function submitQueryOrder(service: Service) {
  const { data, status } = connect({
    serviceId: service.id,
    type: 'order',
  })

  watch(
    status,
    (value) => {
      if (value !== 'OPEN') {
        console.warn('[3un] WebSocket 连接失败', value)
        return
      }

      submitOrder(service)
      uStore.updateCredit()
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
  }

  const response = orderApi.submit(params)
  response.then(({ data }) => {
    store.addRecentService(service.id)

    if (service.isUnlock) {
      toast.success('提交成功，请稍后前往“我的订单”页面查看')
      return
    }

    renderSubmitOrderResult(data)
  })

  response.catch((err) => {
    console.error('[3un] 提交订单失败', err)
    close()
  })

  response.finally(() => {
    submitLoading.value = false
  })
}

function renderSubmitOrderResult(data: OrderSubmitResult[]) {
  const errMsgCol = columns.value[5].field!
  const result = []

  for (let item of data) {
    const index = imeis.value.indexOf(item.imei)
    if (index === -1) return console.error('[3un] IMEI 不存在', item)

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
  if (index === -1) return console.error('[3un] IMEI 不存在', data)
  const resultCol = columns.value[5].field
  const hasResult = resultCol === 'result'

  rawOrders.value[index] = {
    ...rawOrders.value[index],
    ...(hasResult && { result: data.result }),
    ...(!hasResult && processOrderResult(data.result)),
    status: data.status,
    id: data.id,
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

function handleCount() {
  count = count - 1

  if (count === 0) {
    submited.value = true
    return close()
  }
}

function handleExport() {
  const ids = rawOrders.value.map((item) => item.id)
  if (!selectedId.value || !ids?.length) {
    toast.warning('请选择服务')
    return
  }

  exportLoading.value = true
  const response = orderApi.submitExport({
    serviceId: selectedId.value,
    imeiList: imeis.value,
    orderIdList: ids,
  })

  response.then(({ data }) => downloadURL(data))
  response.finally(() => exportLoading.value = false)
}

function reset() {
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

function handlePushMsgChange(value: boolean) {
  if (value) return
  const confirm = window.confirm(`
    确定不接收公众号推送结果吗？\n
    订单量较大时，建议关闭!
  `)

  if (!confirm) pushMsg.value = true
}
</script>

<template>
  <div class="p-4 h-full">
    <section class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <SelectService v-model="selectedId" @selected="handleSelected" />
        <ImportPlane
          :selected-id="selectedId"
          @submit="handleImport"
        />
  
        <XButton label="提交" :loading="submitLoading" @click="handleSubmit" />
        <XButton label="导出" color="emerald" @click="handleExport" />
        <XButton label="清空" color="rose" @click="reset" />
        <XButton
          v-if="mustRead" variant="outline"
          label="服务说明" color="amber"
          @click="mustReadVisible = true"
        />

        <XSwitch
          v-model="pushMsg" label="推送结果"
          @change="handlePushMsgChange"
        />
      </div>

      <XPagination
        v-model="page"
        v-model:size="pageSize"
        :total="rawOrders.length"
        hideOnSinglePage
      />
    </section>
    <AgGridVue
      :theme="tableTheme"
      :rowData="orders"
      :columnDefs="columns"
      :defaultColDef="columnOpts"
      class="h-[calc(100%-3rem)]"
    />

    <MustRead
      v-model="mustReadVisible"
      :must-read="mustRead"
    />
  </div>
</template>

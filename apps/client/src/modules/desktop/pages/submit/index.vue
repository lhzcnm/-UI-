<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import ImportPlane from './components/ImportPlane.vue'
import MustRead from './components/MustRead.vue'
import type { TableColumn } from '@3un/ui';
import { XTag, XButton } from '@3un/ui'


import { toast } from 'vue-sonner'
import { hash } from 'ohash'

import type { Order, OrderTableView, OrderSubmitResult } from '@/api/orders'
import type { Service } from '@/api/services'
import { serviceApi } from '@/api/services'
import { orderApi } from '@/api/orders'


import { ORDER_STATUS,ORDER_STATUS_MAP, ORDER_VERTIFY } from '@3un/shared/enums'

import { downloadURL } from '@3un/utils'

const props = defineProps<{ id: string }>()

const uStore = useUserStore()
const store = useServiceStore()
const { connect, close } = useWsStore()

const page = ref(1)
const pageSize = ref(50)

const rawOrders = ref<OrderTableView[]>([])

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

  const serviceCols: TableColumn[] = []
  for (const item of data) {
    const { name, width } = item
    const field = hash(name)
    serviceCols.push({
      key: field,
      title: name,
      width: width,
      tdClassName: 'leading-6 py-1',
      render: (_: any, row: any) => {
        return row ? row[field] ?? '-' :'-';
      },
    })
  }

  const len = columns.length
  const frontCols = columns.slice(0, len - 2)
  const endCols = columns.slice(-1)

  columns.splice(0, columns.length, ...frontCols, ...serviceCols, ...endCols);
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
  const resultColumn = columns.find(col => col.key === 'result');
  const errMsgCol = resultColumn ? resultColumn.key : 'result';
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
  const resultColumn = columns.find(col => col.key === 'result');
  const resultCol = resultColumn ? resultColumn.key : 'result';
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

const columns: TableColumn[] = [
  { key: 'index', title: '序号', width: 64 },
  {
    key: 'service',
    title: '服务',
    width: 220,
    render: (_: any, row: OrderTableView) => {
      if (!row) return '请选择服务';
      if (row.serviceId) {
        return `${row.serviceId} - ${row.serviceName}`;
      }
      return '请选择服务';
    },
  },
  { key: 'imei', title: 'IMEI/SN', width: 164 },
  { key: 'credits', title: '积分', width: 88 },
  {
    key: 'status',
    title: '订单状态',
    width: 128,
    render: (_: any, row: OrderTableView) => {
      const id = row?.status || ORDER_STATUS.WAIT;
      const tag = ORDER_STATUS_MAP[id];
      return h(XTag, {
        color: tag?.color,
        label: tag?.label,
      });
    },
  },
  {
    key: 'result',
    title: '订单结果',
    flex: true,
    width: 300,
    tdClassName: 'leading-6 py-1',
    render: (_: any, row: OrderTableView) => {
      return row?.result ?? '-';
    },
  },
  { key: 'remark', title: '备注', width: 180, flex: true },
];
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
  
    <XTable
      v-if="!submitLoading"
      :data="orders"
      :columns="columns"
      row-key="index"
      class="h-[calc(100%-3rem)]"
    />


    <MustRead
      v-model="mustReadVisible"
      :must-read="mustRead"
    />
  </div>
</template>

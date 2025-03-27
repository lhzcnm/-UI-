<script setup lang="ts">
// import type { TableColumn } from '@3un/ui'
import { XTag, XButton } from '@3un/ui'

import type { Order, OrderListResponse } from '@/api/orders'
import { ORDER_STATUS_MAP, ORDER_VERTIFY_MAP } from '@3un/shared/enums'
import { orderApi } from '@/api/orders'

const serviceStore = useServiceStore()
const orders = ref<OrderListResponse>({
  list: [],
  page: 1,
  pageSize: 10,
  total: 0,
})

const selectedList = ref<Order[]>([])
const page = ref(1)
const limit = ref(20)

await Promise.all([
  serviceStore.getServices(),
  getList(page.value, limit.value),
])

watch(
  [page, limit],
  async ([pageVal, limitVal]) => {
    await getList(pageVal, limitVal)
  },
)

async function getList(pageVal: number, limitVal: number) {
  const { data } = await orderApi.list({
    pageSize: limitVal,
    page: pageVal,
  })

  orders.value = data
}

const columns = [
  { key: 'id', title: 'ID', width: 108, },
  {
    key: 'service',
    title: '服务',
    width: 220,
    render: (_: any, row: Order) => {
      const service = serviceStore.services.get(row.serviceId)

      if (!service) return '未知'
      return `${service.id} - ${service.title}`
    },
  },
  { key: 'imei', title: 'IMEI/SN', width: 168, },
  { key: 'credits', title: '积分', width: 68, },
  {
    key: 'status',
    title: '订单状态',
    width: 98,
    render: (value: any) => {
      const tag = ORDER_STATUS_MAP[value]
      return h(XTag, {
        color: tag?.color,
        label: tag?.label,
      })
    },
  },
  {
    key: 'verify',
    title: '验证状态',
    width: 98,
    render: (value: any) => {
      const tag = ORDER_VERTIFY_MAP[value]
      return h(XTag, {
        color: tag?.color,
        label: tag?.label,
      })
    },
  },
  {
    key: 'result',
    title: '订单结果',
    width: 320,
    flex: true,
    render: (value: any) => {
      return h('div', { innerHTML: value })
    },
  },
  { key: 'remark', title: '备注', width: 180 },
  {
    key: 'action',
    title: '操作',
    width: 168,
    fixed: 'right',
    render: () => {
      return [
        h(XButton, {
          label: '编辑',
          size: 'sm',
        }),
        h(XButton, {
          label: '删除',
          color: 'rose',
          size: 'sm',
        }),
      ]
    },
  },
]
</script>

<template>
  <div class="mx-8 mt-8">
    <section class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <XSelect multiple>
          <XSelectItem
            v-for="column in columns" :key="column.key"
            :value="column.key" :label="column.title"
            active-class="border-l-4 border-blue-500 italic"
          />
        </XSelect>
        <XButton loading label="新增" />
      </div>
      <XPagination
        v-model="page"
        v-model:size="limit"
        :total="orders.total"
        :layouts="[
          'total',
          'sizes',
          'prev',
          'pager',
          'next',
          'jumper',
        ]"
      />
    </section>
    <XTable
      v-model:selected-list="selectedList"
      :data="orders.list" :columns="columns"
      selection row-key="id" selected-key="id"
      class="h-[calc(100vh-7rem)]"
    />
  </div>
</template>

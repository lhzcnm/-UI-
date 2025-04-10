<script setup lang="ts">
import type { TableColumn } from '@3un/ui'
import { XTag, XButton } from '@3un/ui'

import type { Order, OrderListResponse } from '@/api/orders'
import { ORDER_STATUS, ORDER_STATUS_MAP, ORDER_VERTIFY, ORDER_VERTIFY_MAP } from '@3un/shared/enums'
import { orderApi } from '@/api/orders'

const serviceStore = useServiceStore()
const orders = ref<OrderListResponse>({
  list: [],
  page: 1,
  pageSize: 10,
  total: 0,
})

const page = ref(1)
const limit = ref(5)

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

const columns: TableColumn[] = [
  { key: 'id', title: '订单号', width: 98 },
  {
    key: 'service',
    title: '服务',
    width: 220,
    render: (_: any, row: Order) => {
      const service = serviceStore.services.get(row.serviceId)

      if (!service) return '服务不存在'
      return `${service.id} - ${service.title}`
    },
  },
  { key: 'imei', title: 'IMEI/SN', width: 158 },
  { key: 'credits', title: '积分', width: 58 },
  {
    key: 'status',
    title: '订单状态',
    width: 88,
    render: (value: ORDER_STATUS) => {
      const tag = ORDER_STATUS_MAP[value]
      return h(XTag, tag)
    }
  },
  {
    key: 'verify',
    title: '验证状态',
    width: 88,
    render: (value: ORDER_VERTIFY) => {
      const tag = ORDER_VERTIFY_MAP[value]
      return h(XTag, tag)
    }
  },
  {
    key: 'result',
    title: '订单结果',
    minWidth: 320,
    render: (value: string) => {
      return h('div', { innerHTML: value })
    }
  },
  { key: 'remark', title: '备注', minWidth: 180, },
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
  }
]
</script>

<template>
  <div class="mx-8 mt-8">
    <section class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <XSelect>
          <XSelectItem
            v-for="column in columns" :key="column.key"
            :value="column.key" :label="column.title"
          />
        </XSelect>
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
      :data="orders.list" :columns="columns"
      row-key="id" selection
      class="h-[calc(100vh-7rem)]"
    />
  </div>
</template>

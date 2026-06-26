<script setup lang="ts">
import { getMallOrders } from '@/api/orders'
import { MALL_STORE, type MallStore } from './utils'
import { createList, defaultPageSize, pageSizes } from '@/utils'
import { columns } from './utils/columnMall'

const store: MallStore = reactive({
  page: 1,
  limit: defaultPageSize,

  mallOrders: createList(),
})

provide(MALL_STORE, store)

watch(
  () => [store.page, store.limit],
  ([pageVal, limitVal]) => {
    getMallOderList(
      pageVal,
      limitVal,
    )
  },
  {
    immediate: true,
  },
)

async function getMallOderList(page: number, pageSize: number) {
  const params = {
    page: page,
    pageSize: pageSize,
  }
  const data = await getMallOrders(params)

  store.mallOrders = data
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex items-center space-x-2">
        <XButton
          label="筛选"
          icon="lucide:filter"
        />
        
        <XButton
          label="清空筛选"
          variant="outline"
          icon="lucide:brush-cleaning"
        />

        <!-- <hr class="h-6 w-px mx-4 bg-border" />

        <XButton
          label="清理订单"
          color="danger"
          variant="outline"
          icon="lucide:trash-2"
        /> -->
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="store.mallOrders.total"
        :sizes="pageSizes"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
          'jumper',
        ]"
      />
    </section>
    
    <section class="p-3 pb-0">
      <XTable
        :data="store.mallOrders.list"
        :columns="columns"
        row-key="codeId"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </section>
  </div>
</template>

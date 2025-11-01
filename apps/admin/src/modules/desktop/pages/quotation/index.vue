<script setup lang="ts">
import SelectCategory from './components/SelectCategory.vue'

import { QUOTATION_TYPE } from '@3un/utils'

import { columns } from './utils/columnOldQuotation'
import { getOldQuotations } from '@/api/quotation'
import { OLD_QUOTATION_STORE, type OldQuotationStore } from './utils'
import { zQuotationFormSearch, type QuotationListParams } from '@/inters/quotation'
import { createList } from '@/utils'
import type { XTableExpose } from '@3un/ui'

const store: OldQuotationStore = reactive({
  quotations: createList(),

  formSearch: zQuotationFormSearch.parse({}),

  page: 1,
  limit: 20,

  category: QUOTATION_TYPE.HONGKONG,
})

provide(OLD_QUOTATION_STORE, store)

const tableRef = ref<XTableExpose | null>(null)

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.category,
  ],
  ([pageVal, limitVal, categoryVal]) => {
    getList(categoryVal, {
      page: pageVal,
      pageSize: limitVal,
      ...store.formSearch,
    })
  },
  {
    immediate: true,
  },
)

async function getList(category: QUOTATION_TYPE, params: QuotationListParams) {
  const data = await getOldQuotations(category, params)
  store.quotations = data
  tableRef.value?.scrollToTop()
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex justify-center space-x-2">
        <SelectCategory v-model="store.category" />
        <XButton
          label="筛选"
          icon="lucide:filter"
        />
        <XButton
          label="清空筛选"
          variant="outline"
          icon="lucide:brush-cleaning"
        />
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="store.quotations.total"
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
        ref="tableRef"
        :columns="columns"
        :data="store.quotations.list"
        row-key="id"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </section>
  </div>
</template>

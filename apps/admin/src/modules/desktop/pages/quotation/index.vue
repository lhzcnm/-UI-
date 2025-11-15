<script setup lang="ts">
import FeiyangDialog from './components/FeiyangDialog.vue'
import SelectCategory from './components/SelectCategory.vue'

import { debounce } from '@3un/utils'
import type { XTableExpose } from '@3un/ui'

import { QUOTATION_MAP_ITEM, QUOTATION_STORE, QuotationMap, type QuotationListResult, type QuotationSearchParams, type QuotationStore } from './utils'
import { getQuotationList } from './utils/fn'

const store: QuotationStore<QuotationMap> = reactive({
  visibleBase: false,
  visibleEdit: false,
  visibleSearch: false,
  refresh: false,

  page: 1,
  limit: 20,
  keyword: '',
  id: undefined,

  category: QuotationMap.FEIYANG,
})

provide(QUOTATION_STORE, store)

const quotations = ref<QuotationListResult<typeof store.category>>()
const keyword = ref<string>('')
const loading = ref<boolean>(false)

const tableRef = ref<XTableExpose | null>(null)

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.keyword,
    () => store.refresh,
    () => store.category,
  ],
  async ([pageVal, limitVal, keyword]) => {
    await getQuotationData({
      page: pageVal,
      pageSize: limitVal,
      model: keyword,
    })
  },
  {
    immediate: true,
  }
)

async function getQuotationData(params: QuotationSearchParams<typeof store.category>) {
  loading.value = true
  quotations.value = await getQuotationList(store.category, params)
  tableRef.value?.scrollToTop()
  loading.value = false
}

const columns = computed(() => {
  return QUOTATION_MAP_ITEM[store.category].columns
})

const handleInput = debounce(() => {
  store.keyword = keyword.value
})
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex items-center space-x-2">
        <SelectCategory v-model="store.category" />

        <!-- <XButton
          label="筛选"
          icon="lucide:trash-2"
        /> -->

        <XInput
          ui-root="min-w-80" placeholder="请输入手机型号"
          v-model="keyword" @input="handleInput"
        />

        <XButton
          label="新增报价单"
          color="success"
          icon="lucide:plus"
        />

        <XButton
          label="批量删除"
          icon="lucide:trash-2"
          variant="outline"
          color="danger"
        />
      </div>

      <XPagination
        v-if="quotations"
        v-model="store.page"
        v-model:limit="store.limit"
        :total="quotations!.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
        ]"
      />
    </section>
    <div class="p-3 pb-0">
      <XTable
        v-if="quotations"
        ref="tableRef"
        :loading
        :data="quotations!.list"
        :columns="columns"
        selected-key="id"
        selection
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <FeiyangDialog />
  </div>
</template>

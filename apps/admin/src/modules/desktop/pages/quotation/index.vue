<script setup lang="ts">
import SelectCategory from './components/SelectCategory.vue'

import { debounce, xconfirm } from '@3un/utils'
import type { XTableExpose } from '@3un/ui'

import { toast } from 'vue-sonner'
import { getAppearances, getColors, getDeviceBrand, GetDeviceTypes, getStatues } from '@/api/quotation'
import { QUOTATION_STORE, type QuotationStore } from './utils'
import { QUOTATION_MAP, QUOTATION_MAP_ITEM, QUOTATION_SCHEMA_MAP, type QuotationListResult, type QuotationSearchParams } from '@/utils/quotation'
import { deleteQuotation, getQuotationList } from '@/utils/quotation/fn'

const store: QuotationStore<QUOTATION_MAP> = reactive({
  visibleBase: false,
  visibleEdit: false,
  visibleSearch: false,
  refresh: false,

  page: 1,
  limit: 20,
  keyword: '',
  id: undefined,

  category: QUOTATION_MAP.FEIYANG,
  formBase: {},

  appearances: [],
  colors: [],
  deviceStatuses: [],
  deviceTypes: [],
  brands: [],
  brandsMap: new Map<number, string>(),
})

provide(QUOTATION_STORE, store)

const quotations = ref<QuotationListResult<typeof store.category>>()
const keyword = ref<string>('')
const loading = ref<boolean>(false)

const tableRef = ref<XTableExpose | null>(null)

const selectedIds = ref<number[]>([])

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

const columns = computed(() => {
  return QUOTATION_MAP_ITEM[store.category].columns
})

async function getQuotationData(params: QuotationSearchParams<typeof store.category>) {
  loading.value = true
  quotations.value = await getQuotationList(store.category, params)
  tableRef.value?.scrollToTop()
  loading.value = false
}

function openCreate() {
  store.formBase = QUOTATION_SCHEMA_MAP[store.category].form.parse({})
  store.visibleBase = true
}

async function handleDelete() {
  if(!await xconfirm('确定删除选中的报价单数据?')) return
  deleteQuotation(store.category, selectedIds.value).then(() => {
    toast.success('删除成功')
    store.refresh = !store.refresh
  }).catch(() => {
    toast.error('删除失败, 请重试')
  })
}

async function getAppearanceList() {
  const data = await getAppearances()
  store.appearances = data
}

async function getColorList() {
  const data = await getColors()
  store.colors = data
}

async function getStatusList() {
  const data = await getStatues()
  store.deviceStatuses = data
}

async function getDeviceTypeList() {
  const data = await GetDeviceTypes()
  store.deviceTypes = data
}

async function getBrandList() {
  const data = await getDeviceBrand()
  
  store.brands = data
  for(const item of data) {
    store.brandsMap.set(item.code, item.descCn)
  }
}

await Promise.all([
  getAppearanceList(),
  getColorList(),
  getStatusList(),
  getDeviceTypeList(),
  getBrandList(),
])

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
          ui-root="min-w-80" placeholder="请输入设备型号"
          clearable
          v-model="keyword" @input="handleInput"
        />

        <XButton
          label="新增报价单"
          color="success"
          icon="lucide:plus"
          @click="openCreate"
        />

        <XButton
          label="批量删除"
          icon="lucide:trash-2"
          variant="outline"
          color="danger"
          @click="handleDelete"
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
        @select-change="selectedIds = $event"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <!-- <FeiyangDialog /> -->
    <component :is="QUOTATION_SCHEMA_MAP[store.category].dialog" />
  </div>
</template>

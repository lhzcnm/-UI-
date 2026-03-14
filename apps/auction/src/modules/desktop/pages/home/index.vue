<script setup lang="ts">
import ProductSearch from './components/ProductSearch.vue'
import BatchUpdatePrice from './components/BatchUpdatePrice.vue'
import ProductImport from './components/ProductImport.vue'

import { toast } from 'vue-sonner'
import { PRICE_TYPE, xconfirm } from '@3un/utils'

import { zProductImport, zProductSearch, type ProductSearchParams, type ProductUpdate } from '@/inters/product'
import { HOME_STORE, type HomeStore } from './utils'
import { zBatchPriceUpdate, type BatchPriceUpdate } from '@/inters/batch'
import { createList } from '@/utils/common'
import { deleteProduct, getProductRecords, updateProductRecord } from '@/api/product'
import { columns } from './utils/columnProduct'

const store: HomeStore = reactive({
  visibleSearch: false,
  visibleBatchUpdatePrice: false,
  visibleUploadPrice: false,
  visibleImport: false,

  importType: 'database',

  formSearch: zProductSearch.parse({}),
  formBatchUpdate: zBatchPriceUpdate.parse({}),
  formImport: zProductImport.parse({}),

  products: createList(),

  page: 1,
  pageSize: 20,
  refresh: false,
})

provide(HOME_STORE, store)

const selectIds = ref<number[]>([])
const loading = ref<boolean>(false)

watch(
  () => store.pageSize,
  () => {
    store.page = 1
  }
)

watch(
  [
    () => store.page,
    () => store.pageSize,
    () => store.refresh,
  ],
  async ([pageVal, sizeVal]) => {
    await getLists({
      ...store.formSearch,
      pageNum: pageVal,
      pageSize: sizeVal,
    })
  },
  { immediate: true }
)

async function getLists(params: ProductSearchParams) {
  try {
    loading.value = true
    store.products = await getProductRecords(params)
    loading.value = false
  } catch(err) {
    console.log(err)
  }
}

function initFilter() {
  store.formSearch = zProductSearch.parse({})
  store.refresh = !store.refresh
}

function openBatchUpdate() {
  if (selectIds.value.length === 0) return toast.warning('请选择要修改的列')

  store.formBatchUpdate = zBatchPriceUpdate.parse({})
  store.visibleBatchUpdatePrice = true
}

function processUpdateData(form: BatchPriceUpdate) {
  const updateData: ProductUpdate[] = []

  selectIds.value.forEach(id => {
    const index = store.products.list.findIndex(p => p.id === id)

    if (index === -1) return
    const data = store.products.list[index]

    updateData.push({
      id: data.id,
      sku: data.sku,
      model: data.model,
      color: data.colorName,
      capacity: data.capacity,
      grade: data.grade,
      price: (form.type === PRICE_TYPE.ADD ? +(data.price ?? '0.00') + form.price : (+(data.price ?? '0.00')) - form.price).toString(),
      lockStatus: data.lockStatus,
      scopeType: data.scopeType,
    })
  })

  return updateData
}

async function updateProductPrices() {
  try {
    store.visibleBatchUpdatePrice = false
    const updateData = processUpdateData(store.formBatchUpdate)

    await updateProductRecord(updateData)
    toast.success('价格更新成功')
    store.refresh = !store.refresh
  } catch {}
}

function openImport() {
  // store.importType = type
  store.formImport = zProductImport.parse({})
  store.visibleImport = true
}

async function batchDelete() {
  if (selectIds.value.length === 0) return toast.warning('请选择要删除的列')

  if (!await xconfirm('是否确认删除? ')) return

  try {
    await deleteProduct(selectIds.value)
    toast.success('删除成功')
    store.refresh = !store.refresh
  } catch {}
}
</script>

<template>
  <div>
    <section class="p-3 border-b flex justify-between">
      <div class="flex items-center space-x-2">
        <XButton @click="store.visibleSearch = true" label="筛选" icon="tabler:filter" />
        <XButton @click="initFilter" label="清空筛选" variant="outline" icon="tabler:trash" />

        <hr class="w-px h-full bg-border" />

        <XButton @click="openBatchUpdate" label="批量修改价格" color="warning" icon="tabler:report-money" />
        <XButton @click="openImport" label="导入/更新数据" color="success" icon="tabler:database-import" />
        <!-- <XButton @click="openImport('excel')" label="Excel 导出价格记录" color="success" icon="tabler:file-import" /> -->

        <hr class="w-px h-full bg-border" />

        <XButton @click="batchDelete" label="批量删除" icon="tabler:trash" color="danger" />
      </div>

      <XPagination v-model="store.page"
        v-model:limit="store.pageSize"
        :total="store.products.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes'
        ]" />
    </section>

    <div class="p-3 pb-0">
      <XTable :columns="columns"
        :data="store.products.list"
        :loading="loading"
        class="h-[calc(100vh-8.75rem)] border"
        selection
        selected-key="id"
        @select-change="selectIds = $event" />
    </div>

    <ProductSearch />
    <BatchUpdatePrice @confirm="updateProductPrices" />
    <ProductImport />
  </div>
</template>

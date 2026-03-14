<script setup lang="ts">
import { useCopyFn } from '@3un/utils'

import { HOME_STORE } from '../utils'
import ProductSearchForm from './forms/ProductSearchForm.vue'
import { type ProductSearch } from '@/inters/product'

const store = inject(HOME_STORE)!

const clone = useCopyFn(() => toRaw(store.formSearch))
const copied = ref<ProductSearch>(clone())

watch(
  () => store.visibleSearch,
  () => copied.value = clone()
)

function handleConfirm() {
  store.page = 1
  store.refresh = !store.refresh
  store.visibleSearch = false
}
</script>

<template>
  <XDialog v-model="store.visibleSearch"
    draggable
    title="筛选"
    ui-root="sm:p-0 sm:max-w-lg"
    ui-header="p-4 border-b">
    <template #default>
      <ProductSearchForm class="p-4 border-b" v-model="store.formSearch" />
    </template>

    <template #footer>
      <div class="p-4 flex items-center justify-end space-x-2">
        <XButton @click="store.visibleSearch = false" variant="soft" label="取消" />
        <XButton @click="handleConfirm" label="筛选" />
      </div>
    </template>
  </XDialog>
</template>

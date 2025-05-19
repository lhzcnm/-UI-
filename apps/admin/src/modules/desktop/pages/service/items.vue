<script setup lang="ts">
import ItemForm from './components/ItemForm.vue'

import { zServiceForm } from '@/inters/services'
import { SERVICE_STORE, type ServiceStore } from './utils'
import { columns } from './utils/columnItem'

const route = useRoute()

const serviceStore = useServiceStore()
const store: ServiceStore = reactive({
  formBase: zServiceForm.parse({}),
  formSearch: {
    categoryId: undefined,
    keyword: '',
  },
  visibleBase: false,
  index: undefined,
})

provide(SERVICE_STORE, store)

watch(
  () => route.query,
  () => {
    const { cid, id } = route.query
    store.formSearch.categoryId = cid ? +cid : undefined
    store.formSearch.keyword = (id as string) || ''
  },
  { immediate: true }
)

const displayItems = computed(() => {
  let items = serviceStore.items
  let { categoryId, keyword } = store.formSearch
  keyword = keyword.trim().toLowerCase()

  if (categoryId !== undefined) {
    items = items.filter(item => item.categoryId === categoryId)
  }

  if (keyword) {
    items = items.filter(item =>
      item.tmpTitle.toLowerCase().includes(keyword) ||
      item.packageTitle.toLowerCase().includes(keyword) ||
      item.packageTitleLocal.toLowerCase().includes(keyword) ||
      item.packageId.toString().includes(keyword)
    )
  }

  return items
})

function openCreate() {
  store.formBase = zServiceForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <section class="flex space-x-2 p-3 border-b">
      <XSelect
        v-model="store.formSearch.categoryId"
        placeholder="请选择服务组"
        ui-trigger="w-64"
        clearable
      >
        <XSelectItem
          v-for="item in serviceStore.groups"
          :key="item.categoryId"
          :value="item.categoryId"
          :label="item.category"
        />
      </XSelect>
      <XInput
        v-model="store.formSearch.keyword"
        placeholder="请输入关键词" clearable
        ui-root="w-64"
      />
      <XButton
        icon="lucide:circle-plus"
        label="新增服务" @click="openCreate"
      />
    </section>

    <div class="p-3">
      <XTable
        :data="displayItems"
        :columns="columns"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <ItemForm />
  </div>
</template>

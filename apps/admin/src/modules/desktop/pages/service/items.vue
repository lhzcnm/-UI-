<script setup lang="ts">
import ItemCreate from './components/ItemCreate.vue'
import ItemUpdate from './components/ItemUpdate.vue'

import { zServiceForm } from '@/inters/services'
import { SERVICE_STORE, type ServiceStore } from './utils'
import { columns } from './utils/columnItem'
import { XPagination } from '@3un/ui'

const serviceStore = useServiceStore()
const store: ServiceStore = reactive({
  createForm: zServiceForm.parse({}),
  updateForm: zServiceForm.parse({}),
  visableCreate: false,
  visableUpdate: false,
  page: 1,
  limit: 20,
})

provide(SERVICE_STORE, store)

const displayItems = computed(() => {
  return serviceStore.items.slice(
    (store.page - 1) * store.limit,
    store.page * store.limit
  )
})
</script>

<template>
  <div class="px-3">
    <section class="flex justify-between my-3">
      <XButton label="新增服务" @click="store.visableCreate = true" />
      <XPagination
        v-model="store.page"
        v-model:size="store.limit"
        :total="serviceStore.items.length"
        :layouts="['total', 'prev', 'pager', 'next', 'sizes']"
      />
    </section>
    <XTable
      :data="displayItems"
      :columns="columns"
      class="!bg-background h-[calc(100vh-8rem)]"
    />

    <ItemCreate />
    <ItemUpdate />
  </div>
</template>

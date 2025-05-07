<script setup lang="ts">
import ItemForm from './components/ItemForm.vue'
import { SERVICE_STORE, type ServiceStore } from './utils'
import { columns } from './utils/columnItem'

import { XPagination } from '@3un/ui'
import { zService } from '@/inters/services'

const serviceStore = useServiceStore()
const store: ServiceStore = reactive({
  form: zService.parse({}),
  visable: false,
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

function openCreate() {
  store.form = zService.parse({})
  store.visable = true
}
</script>

<template>
  <div class="px-3">
    <section class="flex justify-between my-3">
      <XButton label="新增服务" @click="openCreate" />
      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="serviceStore.items.length"
        :layouts="['total', 'prev', 'pager', 'next', 'sizes']"
      />
    </section>
    <XTable
      :data="displayItems"
      :columns="columns"
      class="h-[calc(100vh-7.75rem)]"
    />

    <ItemForm />
  </div>
</template>

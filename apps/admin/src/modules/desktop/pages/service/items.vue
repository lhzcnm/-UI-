<script setup lang="ts">
import ItemForm from './components/ItemForm.vue'
import { SERVICE_STORE, type ServiceStore } from './utils'
import { columns } from './utils/columnItem'

import { XPagination } from '@3un/ui'
import { zService } from '@/inters/services'

const serviceStore = useServiceStore()
const store: ServiceStore = reactive({
  form: zService.parse({}),
  visible: false,
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
  store.visible = true
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <XButton icon="lucide:circle-plus" label="新增服务" @click="openCreate" />
      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="serviceStore.items.length"
        :layouts="['total', 'prev', 'pager', 'next', 'sizes']"
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

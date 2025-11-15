<script setup lang="ts">
import FieldModal from './components/FieldModal.vue'
import FieldCard from './components/FieldCard.vue'

import type { ServiceFieldListParams } from '@/inters/services'
import { zServiceFieldForm } from '@/inters/services'
import { getServiceFields } from '@/api/services'
import { createList } from '@/utils'

import { FIELD_STORE, type ServiceFieldStore } from './utils'

const serviceStore = useServiceStore()
await serviceStore.getItems()

const store: ServiceFieldStore = reactive({
  fields: createList(),

  formBase: zServiceFieldForm.parse({}),
  visibleBase: false,

  refresh: false,
  loading: false,
  index  : undefined,
  page   : 1,
  limit  : 20,
})

provide(FIELD_STORE, store)

const serviceId = ref<number>()
const loading = ref(false)

watch(
  [
    () => serviceId.value,
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([serviceId, page, limit]) => {
    if(serviceId) {
      store.formBase.serviceId = serviceId
    }
    getList({ page, pageSize: limit, serviceId })
  },
  { immediate: true },
)

function getList(params: ServiceFieldListParams) {
  loading.value = true

  const response = getServiceFields(params)
  response.then((data) => store.fields = data)
  response.finally(() => loading.value = false)
}

function openCreate() {
  if(!serviceId.value) {
    store.formBase = zServiceFieldForm.parse({})
  }
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <Toolbar :loading="loading">
      <XSimplePagination 
        v-model="store.page"
        :limit="store.limit"
        :total="store.fields.total"
      />

      <template #extra>
        <div class="space-y-3" @click.stop>
          <div>
            <label class="block text-sm text-label mb-1">服务组</label>
            <NativeSelectService v-model="serviceId" />
          </div>
          <div>
            <label class="block text-sm text-label mb-1">操作</label>
            <XButton
              label="新增字段"
              color="success"
              icon="lucide:circle-plus"
              @click="openCreate"
            />
          </div>
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <FieldCard
        v-for="(item, index) in store.fields.list"
        :key="item.id" :item="item" :index="index"
      />
    </section>

    <FieldModal />
  </div>
</template>

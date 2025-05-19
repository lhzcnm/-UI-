<script setup lang="ts">
import FieldForm from './components/FieldForm.vue'
import { columns } from './utils/columnField'

import type { ServiceFieldListParams } from '@/inters/services'
import { zServiceFieldForm, zServiceField } from '@/inters/services'
import { deleteServiceField, getServiceFields } from '@/api/services'

import type { ServiceFieldStore } from './utils'
import { FIELD_STORE } from './utils'
import { toast } from 'vue-sonner'

const serviceStore = useServiceStore()
await serviceStore.getItems()

const store: ServiceFieldStore = reactive({
  fields: { list: [], page: 1, total: 0, pageSize: 20 },
  formBase: zServiceFieldForm.parse({}),
  visibleBase: false,
  index: undefined,
  loading: false,
  refresh: false,
  page: 1,
  limit: 20,
})

provide(FIELD_STORE, store)

const serviceId = ref<number>()
const ids = ref<number[]>([])
const loading = ref(false)

watch(
  [
    () => serviceId.value,
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([serviceId, page, limit]) => {
    getList({ page, pageSize: limit, serviceId })
  },
  { immediate: true },
)

function getList(params: ServiceFieldListParams) {
  loading.value = true

  const response = getServiceFields(params)
  response.finally(() => loading.value = false)
  response.then((data) => {
    const list = data.list.map((item) => zServiceField.parse(item))
    store.fields = { ...data, list }
  })
}

function openCreate() {
  store.formBase = zServiceFieldForm.parse({})
  store.index = undefined
  store.visibleBase = true
}

function handleDelete() {
  if (!ids.value.length) {
    toast.warning('请选择要删除的字段')
    return
  }

  deleteServiceField(ids.value).then(() => {
    getList({ page: store.page, pageSize: store.limit })
    toast.success('删除成功')
  })
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex space-x-2">
        <SelectService v-model="serviceId" clearable ui-trigger="w-56" />
        <XButton icon="lucide:circle-plus" label="新增" @click="openCreate" />
        <XButton color="danger" icon="lucide:trash" label="批量删除" @click="handleDelete" />
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="store.fields.total"
        :layouts="['total', 'prev', 'pager', 'next', 'sizes']"
      />
    </section>

    <div class="p-3">
      <XTable
        :data="store.fields.list"
        :columns="columns"
        :loading="loading"
        row-key="id"
        selection selected-key="id"
        class="border h-[calc(100vh-8.75rem)]"
        @select-change="ids = $event"
      />
    </div>

    <FieldForm />
  </div>
</template>

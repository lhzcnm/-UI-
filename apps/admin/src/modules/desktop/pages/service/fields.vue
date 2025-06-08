<script setup lang="ts">
import FieldDialog from './components/FieldDialog.vue'

import { toast } from 'vue-sonner'

import type { ServiceFieldListParams } from '@/inters/services'
import { zServiceFieldForm, zServiceField } from '@/inters/services'
import { deleteServiceField, getServiceFields } from '@/api/services'

import { FIELD_STORE, type ServiceFieldStore } from './utils'
import { columns } from './utils/columnField'

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
      <div class="flex items-center">
        <SelectService
          v-model="serviceId"
          ui-trigger="w-56"
          clearable
        />

        <hr class="h-6 w-px mx-4 bg-border" />

        <XButton
          label="新增"
          class="mr-2"
          color="success"
          icon="lucide:circle-plus"
          @click="openCreate"
        />

        <XButton
          label="批量删除"
          color="danger"
          icon="lucide:trash"
          @click="handleDelete"
        />
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

    <FieldDialog />
  </div>
</template>

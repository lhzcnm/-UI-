<script setup lang="ts">
import SearchDialog from './components/SearchDialog.vue'

import type { LogListParams } from '@/inters/logs'
import { zLogSearchForm } from '@/inters/logs'
import { deleteLogs, getLogs } from '@/api/logs'

import { toast } from 'vue-sonner'
import { USER_ROLE, xconfirm } from '@3un/utils'

import type { LogStore } from './utils'
import { LOG_STORE } from './utils'
import { columns } from './utils/column'

const store: LogStore = reactive({
  logs: { list: [], total: 0, page: 1, pageSize: 20 },
  formSearch: zLogSearchForm.parse({}),
  visibleSearch: false,
  refresh: false,
  page: 1,
  limit: 20,
})

provide(LOG_STORE, store)

const route = useRoute()
const loading = ref(false)
const ids = ref<number[]>([])

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([pageValue, limitValue]) => {
    getList({
      page: pageValue,
      pageSize: limitValue,
      ...store.formSearch,
    })
  },
)

watch(
  () => route.query.q,
  (value) => {
    store.formSearch = zLogSearchForm.parse({})
    store.refresh = !store.refresh
    store.page = 1

    if (value === 'user') {
      store.formSearch.role = USER_ROLE.USER
    }
    if (value === 'admin') {
      store.formSearch.role = USER_ROLE.ADMIN
    }
  },
  { immediate: true },
)

function getList(params: LogListParams) {
  loading.value = true

  const response = getLogs(params)
  response.then(data => store.logs = data)
  response.finally(() => loading.value = false)
}

function resetSearch() {
  store.formSearch = zLogSearchForm.parse({})
  store.refresh = !store.refresh
}

async function handleDelete() {
  if (ids.value.length === 0) {
    return toast.warning('请选择要删除的记录')
  }

  if (!await xconfirm('确定删除这些记录吗？')) return
  deleteLogs(ids.value).then(() => {
    store.refresh = !store.refresh
  })
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex space-x-2">
        <XButton
          color="success" icon="lucide:filter"
          label="筛选" @click="store.visibleSearch = true"
        />
        <XButton
          color="warning" icon="lucide:brush-cleaning"
          label="清空筛选" @click="resetSearch"
        />
        <XButton
          color="danger" icon="lucide:trash-2"
          label="删除记录" @click="handleDelete"
        />
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="store.logs.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
          'jumper',
        ]"
      />
    </section>

    <div class="p-3">
      <XTable
        :columns="columns"
        :data="store.logs.list"
        :loading="loading"
        row-key="id" selected-key="id"
        @selection-change="ids = $event"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <SearchDialog />
  </div>
</template>

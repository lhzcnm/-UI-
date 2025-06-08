<script setup lang="ts">
import PaidSearch from './components/PaidSearch.vue'

import type { UserPaidListParams } from '@/inters/users'
import { zUserPaidSearchForm } from '@/inters/users'
import { getUserPaidList } from '@/api/users'

import type { PaidStore } from './utils'
import { columns } from './utils/columnPaid'
import { PAID_STORE } from './utils'

const store: PaidStore = reactive({
  users        : { list: [], page: 1, total: 0, pageSize: 20 },
  formSearch   : zUserPaidSearchForm.parse({}),
  visibleSearch: false,
  refresh      : false,
  page         : 1,
  limit        : 20,
})

provide(PAID_STORE, store)

const loading = ref(false)

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
  { immediate: true },
)

function getList(params: UserPaidListParams) {
  loading.value = true

  const response = getUserPaidList(params)
  response.then((data) => store.users = data)
  response.finally(() => loading.value = false)
}

function resetSearch() {
  store.formSearch = zUserPaidSearchForm.parse({})
  store.refresh = !store.refresh
  store.page = 1
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex items-center">
        <XButton
          label="筛选"
          class="mr-2"
          icon="lucide:filter"
          @click="store.visibleSearch = true"
        />
        <XButton
          label="清空筛选"
          variant="outline"
          icon="lucide:brush-cleaning"
          @click="resetSearch"
        />
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="store.users.total"
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
        :data="store.users.list"
        :loading="loading"
        row-key="userId"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <PaidSearch />
  </div>
</template>

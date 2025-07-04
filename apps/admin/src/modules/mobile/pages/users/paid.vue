<script setup lang="ts">
import PaidCard from './components/PaidCard.vue'
import PaidSearch from './components/PaidSearch.vue'

import type { UserPaidListParams } from '@/inters/users'
import { zUserPaidSearchForm } from '@/inters/users'
import { getUserPaidList } from '@/api/users'
import { createList } from '@/utils'

import type { PaidStore } from './utils'
import { PAID_STORE } from './utils'

const store: PaidStore = reactive({
  users        : createList(),
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
    <Toolbar :loading="loading">
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="store.users.total"
      />

      <template #extra>
        <div class="flex items-center justify-between">
          <div class="space-x-2">
            <XButton
              label="筛选"
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
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="!loading && store.users.list.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <PaidCard
          v-for="(user, index) in store.users.list"
          :key="user.userId" :user="user" :index="index"
        />
      </template>
  </section>

    <PaidSearch />
  </div>
</template>

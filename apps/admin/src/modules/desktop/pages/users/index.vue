<script setup lang="ts">
import UserDrawer from './components/UserDrawer.vue'
import UserSearch from './components/UserSearch.vue'

import type { UserListParams } from '@/inters/users'
import { zUserExtraInfo, zUserForm, zUserPointForm, zUserSearchForm } from '@/inters/users'
import { getUsers } from '@/api/users'

import type { UsersStore } from './utils'
import { USER_STORE } from './utils'
import { columns } from './utils/columnUser'

const store: UsersStore = reactive({
  users: { list: [], page: 1, total: 0, pageSize: 20 },
  extraInfo: zUserExtraInfo.parse({}),
  formBase: zUserForm.parse({}),
  formSearch: zUserSearchForm.parse({}),
  formPoint: zUserPointForm.parse({}),
  visibleBase: false,
  visibleSearch: false,
  visiblePoint: false,
  index: undefined,
  refresh: false,
  page: 1,
  limit: 20,
})

provide(USER_STORE, store)

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

function getList(params: UserListParams) {
  loading.value = true

  const response = getUsers(params)
  response.then((data) => store.users = data)
  response.finally(() => loading.value = false)
}

function openCreate() {
  store.formBase = zUserForm.parse({})
  store.index = undefined
  store.visibleBase = true
}

function resetSearch() {
  store.formSearch = zUserSearchForm.parse({})
  store.page = 1
  store.refresh = !store.refresh
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex space-x-2">
        <XButton color="success" icon="lucide:plus" label="新增用户" @click="openCreate" />
        <XButton icon="lucide:filter" label="筛选" @click="store.visibleSearch = true" />
        <XButton icon="lucide:trash-2" label="清空筛选" color="danger" @click="resetSearch" />
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

    <UserDrawer />
    <UserSearch />
  </div>
</template>

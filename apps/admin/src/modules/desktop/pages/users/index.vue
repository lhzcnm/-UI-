<script setup lang="ts">
import UserForm from './components/UserForm.vue'
import UserSearch from './components/UserSearch.vue'

import type { UserListParams } from '@/inters/users'
import { zUserExtraInfo, zUserForm, zUserSearchForm } from '@/inters/users'
import { getUsers } from '@/api/users'

import type { UsersStore } from './utils'
import { columns } from './utils/columnUser'
import { USER_STORE } from './utils'

const store: UsersStore = reactive({
  users: { list: [], page: 1, total: 0, pageSize: 20 },
  extraInfo: zUserExtraInfo.parse({}),
  formBase: zUserForm.parse({}),
  formSearch: zUserSearchForm.parse({}),
  visibleBase: false,
  visibleSearch: false,
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

function openSearch() {
  store.formSearch = zUserSearchForm.parse({})
  store.visibleSearch = true
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex space-x-2">
        <XButton label="筛选" @click="openSearch" />
        <XButton color="success" label="新增用户" @click="openCreate" />
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

    <UserForm />
    <UserSearch />
  </div>
</template>

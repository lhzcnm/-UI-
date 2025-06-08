<script setup lang="ts">
import UserDrawer from './components/UserDrawer.vue'
import UserSearch from './components/UserSearch.vue'
import UserPoint from './components/UserPoint.vue'
import UserService from './components/UserService.vue'

import type { UserListParams } from '@/inters/users'
import { zUserExtraInfo, zUserForm, zUserPointForm, zUserSearchForm, zUserServiceForm } from '@/inters/users'
import { getUsers } from '@/api/users'

import type { UsersStore } from './utils'
import { columns } from './utils/columnUser'
import { USER_STORE } from './utils'

const store: UsersStore = reactive({
  users: { list: [], page: 1, total: 0, pageSize: 20 },
  extraInfo: zUserExtraInfo.parse({}),
  services: [],

  formBase: zUserForm.parse({}),
  formSearch: zUserSearchForm.parse({}),
  formPoint: zUserPointForm.parse({}),
  formService: zUserServiceForm.parse({}),

  visibleBase: false,
  visibleSearch: false,
  visiblePoint: false,
  visibleService: false,

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

        <hr class="h-6 w-px mx-4 bg-border" />

        <XButton
          label="新增用户"
          color="success"
          icon="lucide:plus"
          @click="openCreate"
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

    <UserDrawer />
    <UserSearch />
    <UserPoint />
    <UserService />
  </div>
</template>

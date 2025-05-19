<script setup lang="ts">
import { zUserExtraInfo, zUserForm, zUserSearchForm } from '@/inters/users'
import type { UserListParams } from '@/inters/users'

import type { UsersStore } from './utils'
import { USER_STORE } from './utils'
import { columns } from './utils/columnUser'
import { getUsers } from '@/api/users'

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
    getList({ page: pageValue, pageSize: limitValue })
  },
  { immediate: true },
)

function getList(params: UserListParams) {
  loading.value = true

  const response = getUsers(params)
  response.then((data) => store.users = data)
  response.finally(() => loading.value = false)
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex space-x-2">
        <XButton label="筛选" />
        <XButton color="success" label="新增用户" />
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
  </div>
</template>

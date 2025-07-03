<script setup lang="ts">
import { zUserExtraInfo, zUserForm, zUserSearchForm, zUserPointForm, zUserServiceForm } from '@/inters/users'
import type { UserListParams } from '@/inters/users'
import { getUsers } from '@/api/users'
import { createList } from '@/utils'

import { USER_STORE, type UsersStore } from './utils'
import UserCard from './components/UserCard.vue'

const store: UsersStore = reactive({
  extraInfo: zUserExtraInfo.parse({}),
  users: createList(),
  services: [],

  formBase: zUserForm.parse({}),
  formSearch: zUserSearchForm.parse({}),
  formPoint: zUserPointForm.parse({}),
  formService: zUserServiceForm.parse({}),

  visibleBase: false,
  visibleSearch: false,
  visiblePoint: false,
  visibleService: false,
  visibleDetail: false,

  refresh: false,
  index: undefined,
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
</script>

<template>
  <div>
    <Toolbar>
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="store.users.total"
      />

      <template #extra>
        <div class="flex items-center justify-between">
          <div class="space-x-2">
            <XButton icon="lucide:filter" label="筛选" />
            <XButton icon="lucide:brush-cleaning" variant="outline" label="清空筛选" />
          </div>
  
          <XButton icon="lucide:plus" color="primary" label="新增用户" />
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.825rem)] space-y-2 p-3">
      <NoMessage
        v-if="store.users.list.length === 0"
        class="bg-card border rounded-lg p-3"
      />
      <template v-else>
        <UserCard
          v-for="(user, index) in store.users.list"
          :key="user.userId" :user="user" :index="index"
        />
      </template>
    </section>
  </div>
</template>

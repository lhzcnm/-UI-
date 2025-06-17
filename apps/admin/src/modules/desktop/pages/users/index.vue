<script setup lang="ts">
import UserDrawer from './components/UserDrawer.vue'
import UserSearch from './components/UserSearch.vue'
import UserPoint from './components/UserPoint.vue'
import UserService from './components/UserService.vue'

import { USER_ROLE } from '@3un/utils'

import type { UserListParams } from '@/inters/users'
import { zUserExtraInfo, zUserForm, zUserPointForm, zUserSearchForm, zUserServiceForm } from '@/inters/users'
import { getUsers } from '@/api/users'
import { createList } from '@/utils'

import type { UsersStore } from './utils'
import { columns } from './utils/columnUser'
import { USER_STORE } from './utils'

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

  refresh: false,
  index: undefined,
  page: 1,
  limit: 20,
})

provide(USER_STORE, store)

const route = useRoute()
const router = useRouter()

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
)

watch(
  () => route.query,
  ({ q, uid }) => {
    store.formSearch = {
      ...store.formSearch,
      userId: uid ? Number(uid) : undefined,
      isAdmin: q === 'admin',
    }

    store.refresh = !store.refresh
    store.page = 1
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
  const isAdmin = route.query.q === 'admin'
  store.formBase = zUserForm.parse({
    role: isAdmin ? USER_ROLE.ADMIN : USER_ROLE.USER,
  })

  store.index = undefined
  store.visibleBase = true
}

function resetSearch() {
  store.formSearch = zUserSearchForm.parse({})
  router.replace({ path: route.path, query: {q: route.query.q} })
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
          label="新增"
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

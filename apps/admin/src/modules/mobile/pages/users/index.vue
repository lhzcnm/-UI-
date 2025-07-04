<script setup lang="ts">
import UserCard from './components/UserCard.vue'
import UserSearch from './components/UserSearch.vue'
import UserModal from './components/UserModal.vue'
import UserDetail from './components/UserDetail.vue'
import UserPoint from './components/UserPoint.vue'
import UserService from './components/UserService.vue'

import { USER_ROLE } from '@3un/utils'
import { hash } from 'ohash'

import { zUserExtraInfo, zUserForm, zUserSearchForm, zUserPointForm, zUserServiceForm } from '@/inters/users'
import type { UserListParams } from '@/inters/users'
import { createList, toUndef } from '@/utils'
import { getUsers } from '@/api/users'

import { USER_STORE, type UsersStore } from './utils'

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

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const queryHash = computed(() => hash(route.query))

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
      planId: toUndef(store.formSearch.planId),
    })
  },
)

watch(
  () => route.query,
  ({ q, uid }) => {
    store.formSearch = {
      ...zUserSearchForm.parse({}),
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
  router.replace({
    force: true,
    path: route.path,
    query: {q: route.query.q}
  })
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
  
          <XButton
            label="新增用户"
            color="primary"
            icon="lucide:plus"
            @click="openCreate"
          />
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="!loading && store.users.list.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <UserCard
          v-for="(user, index) in store.users.list"
          :key="user.userId" :user="user" :index="index"
        />
      </template>
    </section>

    <UserSearch :key="queryHash" />

    <UserModal />
    <UserDetail />
    <UserPoint />
    <UserService />
  </div>
</template>

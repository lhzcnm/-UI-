<script setup lang="ts">
import { debounce } from '@3un/utils'

import { createList } from '@/utils'
import { MONITOR_USER_STORE, type MonitorUserStore } from './utils'
import { zMonitorUserForm, zMonitorUserSearch, type MonitorUserSearchForm } from '@/inters/monitor/user'
import { getMonitorUsers } from '@/api/monitor'
import MonitorUserCard from './components/MonitorUserCard.vue'
import MonitorUserModal from './components/MonitorUserModal.vue'

const store: MonitorUserStore = reactive({
  visibleBase: false,
  visibleTool: false,

  users: createList(),
  userFormSearch: zMonitorUserSearch.parse({}),
  userForm: zMonitorUserForm.parse({}),

  page: 1,
  limit: 20,
  refresh: false,
  id: undefined,
})

provide(MONITOR_USER_STORE, store)

const loading = ref<boolean>(false)

watch(
  [
    () => store.page,
    () => store.refresh,
  ],
  async ([pageVal]) => {
    await getList({
      ...store.userFormSearch,
      page: pageVal,
      pageSize: store.limit,
    })
  },
  {
    immediate: true,
  }
)

async function getList(params: MonitorUserSearchForm) {
  try {
    loading.value = true
    store.users = await getMonitorUsers(params)
  } finally {
    loading.value = false
  }
}

const handleInput = debounce(() => {
  store.refresh = !store.refresh
  store.visibleTool = false
})

function initInput() {
  store.userFormSearch.username = ""
  store.refresh = !store.refresh
  store.visibleTool = false
}

function openCreate() {
  store.userForm = zMonitorUserForm.parse({})
  store.id = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <Toolbar v-model="store.visibleTool" :loading="loading">
      <template #default>
        <XSimplePagination
          v-model="store.page"
          :limit="store.limit"
          :total="store.users.total" />
      </template>
      <template #extra>
        <div class="flex flex-col space-y-2">
          <div class="flex space-x-2">
            <XInput
              class="flex-1"
              placeholder="请输入用户名"
              v-model="store.userFormSearch.username"
              @input="handleInput"
              @click.stop />
            <XButton label="清除筛选" variant="outline" icon="lucide:x" @click="initInput" />
          </div>

          <div class="flex space-x-2">
            <XButton color="success" label="新增用户" icon="lucide:plus" @click="openCreate" />
          </div>
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <template v-if="!loading && store.users.list.length === 0">
        <NoMessage
          class="h-auto bg-card border rounded-lg p-3" />
      </template>

      <template v-else v-for="(item) in store.users.list">
        <MonitorUserCard :user="item" />
      </template>
    </section>

    <MonitorUserModal />
  </div>
</template>

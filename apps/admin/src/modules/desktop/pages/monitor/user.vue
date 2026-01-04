<script setup lang="ts">
import UserDialog from './components/UserDialog.vue'
  
import { toast } from 'vue-sonner'
import { debounce, xconfirm } from '@3un/utils'

import { zMonitorUserForm, zMonitorUserSearch, type MonitorUserSearchForm } from '@/inters/monitor/user'
import { MONITOR_USER_STORE, type MonitorUserStore } from './utils'
import { createList } from '@/utils'
import { deleteMonitorUser, getMonitorUsers } from '@/api/monitor'
import { columns } from './utils/columnUser'
import { type XTableExpose } from '@3un/ui'

const store: MonitorUserStore = reactive({
  visibleBase: false,

  formSearch: zMonitorUserSearch.parse({}),
  formBase: zMonitorUserForm.parse({}),
  users: createList(),

  page: 1,
  limit: 20,
  refresh: false,
  id: undefined,
})

provide(MONITOR_USER_STORE, store)

const loading = ref<boolean>(false)
const ids = ref<number[]>([])
const tableRef = ref<XTableExpose | null> (null)

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  async ([pageVal, limitVal]) => {
    await getList({
      ...store.formSearch,
      page: pageVal,
      pageSize: limitVal,
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
    tableRef.value?.scrollToTop()
  } catch {} finally {
    loading.value = false
  }
}

const handleInput = debounce(() => {
  store.refresh = !store.refresh
})

function initInput() {
  store.formSearch.username = ""
  store.refresh = !store.refresh
}

async function batchDelete() {
  if (ids.value.length === 0) {
    return toast.warning("请选择需要删除的用户")
  }

  if (!await xconfirm("是否确认删除用户?")) {
    return
  } 

  try {
    await deleteMonitorUser(ids.value)
    toast.success("删除成功")
    store.refresh = !store.refresh
  } catch {
    toast.error("删除失败, 请重试")
  }
}

function openCreate() {
  store.formBase = zMonitorUserForm.parse({})
  store.id = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex items-center gap-2">
        <XInput class="w-[16rem]" placeholder="请输入用户名" v-model="store.formSearch.username" @input="handleInput" />
        <XButton label="清除筛选" variant="outline" icon="lucide:x" @click="initInput" />

        <hr class="h-full border w-px mx-2" />

        <XButton color="success" label="新增用户" icon="lucide:plus" @click="openCreate" />
        <XButton color="danger" label="批量删除" icon="lucide:trash-2" @click="batchDelete" />
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

    <div class="p-3 pb-0">
      <XTable
        ref="tableRef"
        :columns="columns"
        :data="store.users.list"
        :loading="loading"
        class="border h-[calc(100vh-8.75rem)]"
        selection
        selected-key="id"
        @select-change="ids = $event"
      />
    </div>

    <UserDialog />
  </div>
</template>

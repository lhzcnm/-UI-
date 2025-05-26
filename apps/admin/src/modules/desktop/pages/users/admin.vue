<script setup lang="ts">
import AdminDialog from './components/AdminDialog.vue'
import { zAdminForm } from '@/inters/users'
import { getAdmins } from '@/api/admin'

import type { AdminStore } from './utils'
import { columns } from './utils/columnAdmin'
import { ADMIN_STORE } from './utils'

const store: AdminStore = reactive({
  formBase: zAdminForm.parse({}),
  visibleBase: false,
  index: undefined,
  admins: [],
})

provide(ADMIN_STORE, store)

await getList()
async function getList() {
  const data = await getAdmins()
  store.admins = data
}

function openCreate() {
  store.formBase = zAdminForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <section class="p-3 border-b">
      <XButton
        color="success" icon="lucide:plus"
        label="新增管理员" @click="openCreate"
      />
    </section>

    <div class="p-3">
      <XTable
        :columns="columns"
        :data="store.admins"
        row-key="userId"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <AdminDialog />
  </div>
</template>

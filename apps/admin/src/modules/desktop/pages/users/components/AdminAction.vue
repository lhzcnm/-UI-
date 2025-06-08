<script setup lang="ts">
import type { User } from '@/inters/users'
import { zAdminForm } from '@/inters/users'
import { deleteAdmin } from '@/api/admin'

import { xconfirm } from '@3un/utils'
import { ADMIN_STORE } from '../utils'

interface AdminActionProps {
  index: number
  row: User
}

const props = defineProps<AdminActionProps>()
const store = inject(ADMIN_STORE)!

function openUpdate() {
  store.formBase = zAdminForm.parse(props.row)
  store.index = props.index
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm('确定删除该管理员吗？')) return
  await deleteAdmin(props.row.userId)
  store.admins.splice(props.index, 1)
}
</script>

<template>
  <XButton label="编辑" size="sm" icon="lucide:edit" @click="openUpdate" />
  <XButton label="删除" size="sm" color="danger" icon="lucide:trash-2" @click="handleDelete" />
</template>

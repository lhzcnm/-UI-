<script setup lang="ts">
import { deleteMonitorUser } from '@/api/monitor'
import { zMonitorUserForm, type MonitorUser } from '@/inters/monitor/user'
import type { XBtnSplitOptions } from '@3un/ui'
import { xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'
import { MONITOR_USER_STORE } from '../utils'

interface UserActionProps {
  row: MonitorUser,
}

const { row } = defineProps<UserActionProps>()

const store = inject(MONITOR_USER_STORE)!

const options: XBtnSplitOptions = [
  {
    label: "删除",
    icon: "lucide:trash-2",
    command: handleDelete,
  }
]

async function handleDelete() {
  if (!await xconfirm("是否确认删除该用户")) return

  try {
    await deleteMonitorUser([row.id])
    toast.success("删除成功")
    store.refresh = !store.refresh
  } catch {
    toast.warning("删除失败")
  }
}

function openUpdate() {
  store.id = row.id
  store.formBase = zMonitorUserForm.parse(row)
  store.visibleBase = true
}
</script>

<template>
  <XButtonSplit
    size="sm"
    label="编辑"
    icon="lucide:edit"
    :options="options"
    @click="openUpdate"
  />
</template>

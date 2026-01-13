<script setup lang="ts">
import { Icon } from "@iconify/vue"

import { xconfirm } from "@3un/utils"
import { toast } from "vue-sonner"

import { zMonitorUserForm, type MonitorUser } from "@/inters/monitor/user"
import { MONITOR_USER_STORE } from "../utils"
import { deleteMonitorUser } from "@/api/monitor"

interface MonitorUserCardProps {
  user: MonitorUser
}

const props = defineProps<MonitorUserCardProps>()

const store = inject(MONITOR_USER_STORE)!

const showPassword = ref(false)

function openUpdate() {
  store.id = props.user.id
  store.userForm = zMonitorUserForm.parse(props.user)
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm("是否确认删除")) return

  try {
    await deleteMonitorUser([props.user.id])
    toast.success("删除成功")
    store.refresh = !store.refresh
  } finally {}
}
</script>

<template>
  <div class="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow">
    <!-- 用户信息 -->
    <div class="flex-1">
      <div class="text-lg font-medium text-foreground">
        {{ props.user.username }}
      </div>
      <div class="text-sm text-muted-foreground">ID: {{ props.user.id }}</div>

      <div class="mt-1 flex items-center gap-2">
        <span class="text-sm text-muted-foreground">
          {{ showPassword ? props.user.password : "••••••••" }}
        </span>
        <button @click="showPassword = !showPassword" class="text-muted-foreground hover:text-foreground transition-colors">
          <Icon icon="lucide:eye" v-if="!showPassword" />
          <Icon icon="lucide:eye-closed" v-else />
        </button>
      </div>
    </div>

    <div class="flex justify-end space-x-2">
      <XButton label="编辑" size="sm" @click="openUpdate" />
      <XButton label="删除" size="sm" color="danger" @click="handleDelete" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MonitorUserForm from './MonitorUserForm.vue'

import { toast } from 'vue-sonner'

import { validate, type ValidRule } from '@/utils'
import { MONITOR_USER_STORE } from '../utils'
import type { MonitorUserCreate, MonitorUserUpdate } from '@/inters/monitor/user'
import { createMonitorUser, updateMonitorUser } from '@/api/monitor'

const store = inject(MONITOR_USER_STORE)!

const isCreate = computed(() => store.id === undefined)

const mode = computed(() => isCreate.value ? "create" : "update")

const options = {
  create: {
    title: "新建",
    subBtn: "新建",
  },
  update: {
    title: "更新",
    subBtn: "保存"
  }
}

function getRules() {
  const { username, password } = store.userForm

  const rules: ValidRule[] = [
    {
      rule: !!username,
      message: "请输入用户名",
    },
    {
      rule: !!password,
      message: "请输入密码",
    },
  ]

  return rules
}

async function handleSubmit() {
  const rules = getRules()
  if (!validate(rules)) return

  if (isCreate.value) await handleCreate(store.userForm)
  else await handleUpdate({ ...store.userForm, id: store.id! })
}

async function handleCreate(body: MonitorUserCreate) {
  try {
    await createMonitorUser(body)
    toast.success("添加成功")
    store.refresh = !store.refresh
    store.visibleBase = false
  } catch {}
}

async function handleUpdate(body: MonitorUserUpdate) {
  try {
    await updateMonitorUser(body)
    toast.success("更新成功")
    store.refresh = !store.refresh
    store.visibleBase = false
  } catch {}
}
</script>

<template>
  <TheModal v-model="store.visibleBase"
    :title="options[mode].title"
    header-class="border-b"
  >
    <div class="flex flex-col p-4">
      <MonitorUserForm v-model="store.userForm"
        class="overflow-y-auto" />

      <div class="flex justify-end space-x-2 mt-2">
        <XButton variant="soft" label="取消" @click="store.visibleBase = false" />
        <XButton :label="options[mode].subBtn" @click="handleSubmit" />
      </div>
    </div>
  </TheModal>
</template>

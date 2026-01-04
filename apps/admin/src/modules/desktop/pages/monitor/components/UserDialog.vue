<script setup lang="ts">
import UserForm from './UserForm.vue'

import { toast } from 'vue-sonner'
import { type FormMode } from '@3un/shared'

import { MONITOR_USER_STORE } from '../utils'
import { validate, type ValidRule } from '@/utils'
import { createMonitorUser, updateMonitorUser } from '@/api/monitor'

const store = inject(MONITOR_USER_STORE)!

const options = {
  create: {
    title: "新增",
    submitText: "新增",
  },
  update: {
    title: "编辑",
    submitText: "保存",
  },
}

const isCreate = computed(() => store.id === undefined)
const mode = computed<FormMode>(() => isCreate.value ? "create" : "update")

function getRules() {
  const { username, password } = store.formBase

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

function handleSubmit() {
  const rules = getRules()
  if (!validate(rules)) return

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

async function handleCreate() {
  try {
    await createMonitorUser(store.formBase)
    toast.success("添加成功")
    store.refresh = !store.refresh
    store.visibleBase = false
  } catch {
    toast.warning("添加失败")
  }
}

async function handleUpdate() {
  try {
    await updateMonitorUser({
      ...store.formBase,
      id: store.id!
    })

    toast.success("更新成功")
    store.refresh = !store.refresh
    store.visibleBase = false
  } catch {
    toast.warning("更新失败")
  }
}
</script>

<template>
  <XDialog
    v-model="store.visibleBase"
    :title="options[mode].title"
    draggable
    ui-root="sm:p-0 sm:max-w-md"
    ui-header="p-4 mb-0 border-b"
  >
    <template #default>
      <UserForm class="p-4" v-model="store.formBase" />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2 border-t">
        <XButton variant="soft" label="取消" @click="store.visibleBase = false" />
        <XButton label="提交" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

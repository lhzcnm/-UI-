<script setup lang="ts">
import dayjs from 'dayjs'
import { toast } from 'vue-sonner'
import type { FormMode } from '@3un/shared'

import { ACTIVITY_STORE } from '../utils'
import ActivityForm from './ActivityForm.vue'
import { validate, type ValidRule } from '@/utils'
import { createActivity, updateActivity } from '@/api/activity'

const store = inject(ACTIVITY_STORE)!

const options = {
  create: {
    title: "新增",
    submitText: "新增"
  },
  update: {
    title: "编辑",
    submitText: "保存",
  },
}

const isCreate = computed(() => store.index === undefined)
const mode = computed<FormMode>(() => isCreate.value ? "create" : "update")

function getRules() {
  const { name, startTime, endTime } = store.formBase

  console.log(startTime)
  const rules: ValidRule[] = [
    {
      rule: !!name,
      message: "请输入活动名称",
    },
    {
      rule: !!startTime,
      message: "请输入开始时间",
    },
    {
      rule: !!endTime,
      message: "请输入结束时间",
    },
  ]

  const start = dayjs(startTime, 'YYYY-MM-DD HH:mm:ss')
  const end = dayjs(endTime, 'YYYY-MM-DD HH:mm:ss')

  rules.push({
    rule: start.isBefore(end),
    message: "开始时间不能晚于结束时间",
  })
  rules.push({
    rule: end.isAfter(start),
    message: "结束时间不能早于开始时间",
  })

  return rules
}

async function handleSubmit() {
  const rules = getRules()
  if(!validate(rules)) return

  if (isCreate.value) await handleCreate()
  else await handleUpdate()
}

async function handleCreate() {
  try {
    await createActivity(store.formBase)
    toast.success("添加成功")
    store.refresh = !store.refresh
  } catch {  } finally {
    store.visibleBase = false
  }
}

async function handleUpdate() {
  const id = store.activities[store.index!].id

  try {
    await updateActivity({
      ...store.formBase,
      id: id,
    })
    toast.success("更新成功")
    store.refresh = !store.refresh
  } catch { } finally {
    store.visibleBase = false
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
      <ActivityForm class="p-4" v-model="store.formBase" />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2 border-t">
        <XButton variant="soft" label="取消" @click="store.visibleBase = false" />
        <XButton label="提交" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

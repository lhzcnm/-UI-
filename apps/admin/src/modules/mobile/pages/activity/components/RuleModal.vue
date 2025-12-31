<script setup lang="ts">
import { zActivityRuleForm, type ActivityRuleCreate, type ActivityRuleUpdate } from '@/inters/activity/rule'
import { ACTIVITY_STORE } from '../utils'
import { createActivityRule, deleteActivityRule, updateActivityRule } from '@/api/activity'
import { toast } from 'vue-sonner'
import RuleFormBase from './RuleFormBase.vue'

const store = inject(ACTIVITY_STORE)!

function getDefaultRule(): ActivityRuleUpdate {
  return  {
    ...zActivityRuleForm.parse({
      activityId: store.activities[store.index!].id,
    }),
    id: -1,
  }
}

function handleAdd() {
  const data = getDefaultRule()
  store.activityRuleForms.unshift(data)
}

async function handleRemove(index: number) {
  const processData = store.activityRuleForms[index]

  try {
    await deleteActivityRule(processData.id)
    toast.success("删除成功")
    store.activityRuleForms.splice(index, 1)
  } catch {}
}

function handleClose() {
  store.activityRuleForms.length = 0
  store.visibleRule = false
}

async function handleSubmit(index: number) {
  const processData = store.activityRuleForms[index]
  const body = zActivityRuleForm.parse(processData)
  const isCreate = processData.id === -1

  if (isCreate) await createRule(body, index)
  else await updateRule({...body, id: processData.id}, index)
}

async function createRule(params: ActivityRuleCreate, index: number) {
  try {
    const data = await createActivityRule(params)
    store.activityRuleForms[index].id = data.id
    toast.success("新增成功")
  } catch {}
}

async function updateRule(params: ActivityRuleUpdate, index: number) {
  try {
    const data = await updateActivityRule(params)
    store.activityRuleForms[index].id = data.id
    toast.success("更新成功")
  } catch {}
}
</script>

<template>
  <TheModal
    v-model="store.visibleRule"
    title="活动规则"
    @close="handleClose"
    class="flex flex-col"
    header-class="border-b">
    <template #default>
      <div class="p-4 flex flex-col space-y-4 overflow-auto">
        <div class="flex justify-end">
          <XButton label="新增规则" @click="handleAdd" />
        </div>
        <div class="flex-1 flex flex-col gap-4 overflow-y-auto">
          <div
            v-for="(_, index) in store.activityRuleForms"
            :key="index" class="border p-4 rounded-md flex flex-col gap-2 relative">
            <div class="">
              <RuleFormBase v-model="store.activityRuleForms[index]" />
            </div>

            <div class="flex justify-end gap-2">
              <XButton color="danger" variant="soft" label="删除" @click="handleRemove(index)" />
              <XButton label="确认" @click="handleSubmit(index)" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </TheModal>
</template>

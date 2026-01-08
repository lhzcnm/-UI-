<script setup lang="ts">
import { zActivityForm, type Activity } from '@/inters/activity'
import type { XBtnSplitOptions } from '@3un/ui'
import { ACTIVITY_STORE } from '../utils'
import { xconfirm } from '@3un/utils';
import { deleteActivity, getActivityRule } from '@/api/activity'
import { toast } from 'vue-sonner'

interface ActivityActionProps {
  row: Activity,
  index: number,
}

const props = defineProps<ActivityActionProps>()

const store = inject(ACTIVITY_STORE)!

const options: XBtnSplitOptions = [
  {
    icon: "lucide:regex",
    label: "活动规则",
    command: openRule,
  },
  {
    icon: "lucide:trash-2",
    label: "删除活动",
    command: handleDelete,
  },
]

function openEdit() {
  store.index = props.index
  store.formBase = zActivityForm.parse(props.row)
  store.visibleBase = true
}

async function handleDelete() {
  if (!await xconfirm("是否确认删除该活动")) return

  try {
    await deleteActivity(props.row.id)
    toast.success("删除成功")
    store.refresh = !store.refresh
  } catch {

  } finally {}
}

async function openRule() {
  try {
    store.activityRules = await getActivityRule(props.row.id)
    store.activityRuleForms = store.activityRules.map(item => ({
      id: item.id,
      activityId: item.activityId,
      minAmount: item.minAmount,
      bonusAmount: item.bonusAmount,
      bonusType: item.bonusType,
      sortOrder: item.sortOrder,
      creditsUsageType: item.creditsUsageType,
    }))
    store.index = props.index
    store.visibleRule = true
  } catch(err) {
    console.error(err)
  }
}
</script>

<template>
  <XButtonSplit
    :options="options"
    label="编辑"
    size="sm"
    @click="openEdit"
  />
</template>

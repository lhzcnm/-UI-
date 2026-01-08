<script setup lang="ts">
import type { XTagColor } from '@3un/ui'
import { ACTIVITY_STATUS, xconfirm } from '@3un/utils'

import { zActivityForm, type Activity } from '@/inters/activity'
import { ACTIVITY_STORE } from '../utils'
import { deleteActivity, getActivityRule } from '@/api/activity'
import { toast } from 'vue-sonner'

interface ActivityCardProps {
  index: number
  activity: Activity
}

const { activity, index } = defineProps<ActivityCardProps>()
const store = inject(ACTIVITY_STORE)!

const isEnabled = computed(() => activity.status === ACTIVITY_STATUS.ENABLE)

const status = computed(() => ({
  color: (isEnabled.value ? 'success' : 'danger') as XTagColor,
  label: isEnabled.value ? '启用' : '禁用'
}))

function openUpdate() {
  store.index = index
  store.formBase = zActivityForm.parse(activity)
  store.visibleBase = true
}

async function openRule() {
  try {
    const id = activity.id
    store.activityRules = await getActivityRule(id)
    store.activityRuleForms = store.activityRules.map(item => ({
      id: item.id,
      activityId: item.activityId,
      minAmount: item.minAmount,
      bonusAmount: item.bonusAmount,
      bonusType: item.bonusType,
      creditsUsageType: item.creditsUsageType,
      sortOrder: item.sortOrder,
    }))
    store.index = index
    store.visibleRule = true
  } finally {}
}

async function handleDelete() {
  if (!await xconfirm("是否确认删除该活动?")) return

  try {
    const id = activity.id

    if (id !== -1) {
      await deleteActivity(id)
    }
    toast.success("删除成功")
    store.refresh = !store.refresh
  } finally {}
}
</script>

<template>
  <div
    class="
      rounded-lg border
      bg-card text-foreground
      border-border
      transition-colors
      hover:bg-accent/10
    "
  >
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <div class="flex flex-col">
        <span class="text-sm font-medium text-foreground">
          {{ activity.name }}
        </span>
        <span class="text-xs text-muted-foreground">
          ID {{ activity.id }}
        </span>
      </div>

      <XTag
        :color="status.color"
        :label="status.label"
        size="sm"
      />
    </div>

    <div class="px-4 py-3 space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-muted-foreground">开始时间</span>
        <span class="text-foreground">
          {{ activity.startTime }}
        </span>
      </div>

      <div class="flex justify-between">
        <span class="text-muted-foreground">结束时间</span>
        <span class="text-foreground">
          {{ activity.endTime }}
        </span>
      </div>
    </div>

    <div
      class="
        flex items-center justify-end gap-2
        px-4 py-3
        border-t border-border
        bg-muted/40
      "
    >
      <XButton
        label="编辑"
        icon="lucide:clipboard-edit"
        size="sm"
        variant="ghost"
        @click="openUpdate"
      />
      <XButton
        label="规则"
        icon="lucide:regex"
        size="sm"
        variant="outline"
        @click="openRule"
      />
      <XButton
        color="danger"
        label="删除"
        icon="lucide:trash-2"
        size="sm"
        @click="handleDelete"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Activity } from '@/inters/activity'

interface SelectActivityProps {
  activitys: Map<number, Activity>
}

defineProps<SelectActivityProps>()
const id = defineModel<number>({ required: true })
</script>

<template>
  <XSelect
    v-model="id"
  >
    <XSelectItem v-for="[key, activity] in activitys" :key="key"
      :value="activity.id" :label="activity.name"
    />
  </XSelect>
</template>

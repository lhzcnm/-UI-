<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

const actions = [
  {
    icon: 'lucide:leaf',
    label: '进入恢复模式',
  },
  {
    icon: 'lucide:vegan',
    label: '退出恢复模式',
  },
  {
    icon: 'lucide:joystick',
    label: '激活设备',
  },
  {
    icon: 'lucide:power-off',
    label: '反激活设备',
  },
]
</script>

<template>
  <div class="flex-1 bg-card border rounded-lg overflow-hidden">
    <div class="grid grid-cols-2 gap-2 p-4 h-full">
      <button
        v-for="action in actions"
        :key="action.label"
        :class="twJoin(
          'flex flex-col space-y-2 rounded',
          'items-center justify-center size-full',
          'hover:bg-muted/50',
        )"
      >
        <Icon :icon="action.icon" class="text-2xl" />
        <span>{{ action.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingAdvanced from './settings/SettingAdvanced.vue'
import SettingAnno from './settings/SettingAnno.vue'
import SettingRoutine from './settings/SettingRoutine.vue'
import SettingTheme from './settings/SettingTheme.vue'

import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

const visible = defineModel<boolean>({ required: true })
const tab = ref('routine')

const options = [
  { label: '常规', value: 'routine', icon: 'lucide:settings' },
  { label: '主题', value: 'theme', icon: 'lucide:palette' },
  { label: '公告', value: 'announcement', icon: 'lucide:microwave' },
  { label: '高级', value: 'advanced', icon: 'lucide:shapes' },
]

const components = {
  routine: SettingRoutine,
  theme: SettingTheme,
  announcement: SettingAnno,
  advanced: SettingAdvanced,
}
</script>

<template>
  <XDialog
    v-model="visible" title="设置"
    uiRoot="sm:max-w-2xl sm:p-0"
    uiHeader="p-3 pb-0"
  >
    <div class="flex px-2">
      <div class="w-40 h-96 space-y-1 text-sm pr-1 border-r border-dashed">
        <button
          v-for="item in options" :key="item.value"
          :class="twJoin(
            'flex items-center w-full px-2 h-10 sm:h-8 space-x-2',
            'rounded hover:bg-accent/15 hover:text-foreground transition-colors',
            tab === item.value && 'bg-accent/15 text-foreground',
          )"
          @click="tab = item.value"
        >
          <Icon :icon="item.icon" class="size-4" />
          <span>{{ item.label }}</span>
        </button>
      </div>
      <div class="flex-1 px-3">
        <component :is="components[tab as keyof typeof components]" />
      </div>
    </div>
  </XDialog>
</template>

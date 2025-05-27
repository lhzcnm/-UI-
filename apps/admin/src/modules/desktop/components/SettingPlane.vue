<script setup lang="ts">
import type { Configs } from '@/inters/settings'
import SettingAdvanced from './settings/SettingAdvanced.vue'
import SettingAnno from './settings/SettingAnno.vue'
import SettingRoutine from './settings/SettingRoutine.vue'
import SettingTheme from './settings/SettingTheme.vue'

import { getConfigs, getSettings } from '@/api/settings'

import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

const visible = defineModel<boolean>({ required: true })

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

const tab = ref('routine')
const settings = ref()
const configs = ref()

await Promise.all([
  getSetting(),
  getConfig(),
])

async function getSetting() {
  const data = await getSettings()
  settings.value = {}

  for (const item of data) {
    if (item.content) {
      settings.value[item.name] = item.content
      continue
    }
    if (item.status) {
      settings.value[item.name] = item.status
    }
  }
}

async function getConfig() {
  const data = await getConfigs()
  configs.value = data.reduce((acc, cur) => {
    acc[cur.key as keyof Configs] = cur.value
    return acc
  }, {} as Configs)
}
</script>

<template>
  <XDialog
    v-model="visible" title="设置"
    uiRoot="sm:max-w-2xl sm:p-0 h-[600px]"
    uiHeader="p-3 pb-0"
  >
    <div class="flex h-[calc(100%-3.5rem)]">
      <div class="w-40 space-y-1 text-sm px-3 border-r">
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
      <component
        :is="components[tab as keyof typeof components]"
        :settings="settings"
        :configs="configs"
      />
    </div>
  </XDialog>
</template>

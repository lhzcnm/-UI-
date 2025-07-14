<script setup lang="ts">
import SettingAdvanced from './components/SettingAdvanced.vue'
import SettingRoutine from './components/SettingRoutine.vue'
import SettingAnno from './components/SettingAnno.vue'

import { Icon } from '@iconify/vue'

import type { Configs } from '@/inters/settings'
import { getConfigs, getSettings } from '@/api/settings'

const iStore = useSystemStore()

const settings = ref()
const configs = ref()

watch(
  () => iStore.showSetting,
  (value) => value && init()
)

await init()

async function init() {
  await Promise.all([
    getSetting(),
    getConfig(),
  ])
}

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
  <div class="p-3 space-y-3">
    <section class="bg-card border rounded-lg p-3">
      <h3 class="flex items-center mb-4">
        <Icon icon="lucide:settings" class="size-6 mr-2" />
        <span class="text-2xl font-bold">常规</span>
      </h3>
      <SettingRoutine :settings="settings" :configs="configs" />
    </section>

    <section class="bg-card border rounded-lg p-3">
      <h3 class="flex items-center mb-4">
        <Icon icon="lucide:microwave" class="size-6 mr-2" />
        <span class="text-2xl font-bold">公告</span>
      </h3>
      <SettingAnno :settings="settings" :configs="configs" />
    </section>
    
    <section class="bg-card border rounded-lg p-3">
      <h3 class="flex items-center mb-4">
        <Icon icon="lucide:shapes" class="size-6 mr-2" />
        <span class="text-2xl font-bold">高级</span>
      </h3>
      <SettingAdvanced :settings="settings" :configs="configs" />
    </section>
  </div>
</template>

<script setup lang="ts">
import TheEditor from './components/TheEditor.vue'
import TheRightPlane from './components/TheRightPlane.vue'

import { getSettings } from '@/api/settings'

import type { EditorStore } from './utils'
import { EDITOR_STORE } from './utils'
import { getActivitys } from '@/api/activity'
import type { Activity } from '@/inters/activity'

const store: EditorStore = reactive({
  settings: {},

  selectedService: 0,
  selectedType: '',
  selectActivity: -1,
  activityMap: new Map<number, Activity>(),
})

provide(EDITOR_STORE, store)

async function getSetting() {
  const data = await getSettings()
  store.settings = {}

  for (const item of data) {
    if (item.content) {
      store.settings[item.name] = item.content
      continue
    }
    if (item.status) {
      store.settings[item.name] = item.status
    }
  }
}

async function getActivities() {
  store.activityMap.clear()
  const data = await getActivitys({})

  for (const item of data) {
    store.activityMap.set(item.id, item)
  }
}

await Promise.all([
  getSetting(),
  getActivities(),
])

const editor = useTemplateRef('editor')
</script>

<template>
  <SplitPlane>
    <template #left>
      <TheEditor ref="editor" />
    </template>
    <template #right>
      <TheRightPlane
        :get-html="editor?.getHtml"
        :set-html="editor?.setHtml"
      />
    </template>
  </SplitPlane>
</template>

<script setup lang="ts">
import TheEditor from './components/TheEditor.vue'
import TheRightPlane from './components/TheRightPlane.vue'

import { getSettings } from '@/api/settings'

import type { EditorStore } from './utils'
import { EDITOR_STORE } from './utils'

const store: EditorStore = reactive({
  settings: {},

  selectedService: 0,
  selectedType: '',
})

provide(EDITOR_STORE, store)

await getSetting()
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

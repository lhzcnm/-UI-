<script setup lang="ts">
import TheEditor from './components/TheEditor.vue'
import TheRightPlane from './components/TheRightPlane.vue'

import { getSettings } from '@/api/settings'

import type { EditorStore } from './utils'
import { EDITOR_STORE } from './utils'
import { getActivitys } from '@/api/activity'
import type { Activity } from '@/inters/activity'
import { getIllustrates, illustrateUploadImg } from '@/api/illustrate'
import { toast } from 'vue-sonner'
import type { IllustrateItem } from '@/inters/illustrate'

const store: EditorStore = reactive({
  settings: {},

  selectedService: 0,
  selectedType: '',
  selectActivity: -1,
  selectIllustrate: '',
  visibleIllustrateCreate: false,

  activityMap: new Map<number, Activity>(),
  illustrates: new Map<string, IllustrateItem>(),
})

provide(EDITOR_STORE, store)

const allowTypes = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif'
]

const MAX_SIZE = 12 * 1024 * 1024
const isAdmin = import.meta.env.VITE_APP_ADMIN

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

async function getIllustrateList() {
  const illustrateData = await getIllustrates()
  for (const illustrate of illustrateData) {
    store.illustrates.set(illustrate.serviceCode, illustrate)
  }
}

await Promise.all([
  getSetting(),
  getActivities(),
  isAdmin === 'true' && getIllustrateList(),
])

const editor = useTemplateRef('editor')

async function handleFile(file: File) {
  if (!allowTypes.includes(file.type)) return toast.warning('只允许上传 PNG / JPG / WEBP / GIF 图片')
  if (file.size > MAX_SIZE) return toast.warning('图片不能大于 12 MB')
  if (!editor.value) return

  const url = await getRemoteUrl(file)
  editor.value.setImage(url)
}

// function fileToBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()

//     reader.onload = () => resolve(reader.result as string)
//     reader.onerror = reject

//     reader.readAsDataURL(file)
//   })
// }

async function getRemoteUrl(file: File) {
  const body = new FormData()
  body.append('file', file)
  return await illustrateUploadImg(body)
}

onMounted(() => {
  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile()
        if (!file) continue

        event.preventDefault()
        handleFile(file)
        return
      }
    }
  }

  window.addEventListener('paste', handlePaste)

  onBeforeUnmount(() => {
    window.removeEventListener('paste', handlePaste)
  })
})
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

<script setup lang="ts">
import TheEditor from './components/TheEditor.vue'

import { toast } from 'vue-sonner'

import { updateService } from '@/api/services'
import { updateSetting } from '@/api/settings'

import type { EditorStore } from './utils'
import { EDITOR_STORE } from './utils'

const store: EditorStore = reactive({
  selected: '',
  result: '',
})

provide(EDITOR_STORE, store)

const options = [
  { label: '中文服务说明', value: 'service' },
  { label: '英文服务说明', value: 'service-en' },
  { label: '滑动公告', value: 'scrollingAnnc' },
  { label: '弹窗公告', value: 'popupAnnc' },
  { label: '充值说明', value: 'paymentInfo' },
]

const route = useRoute()
const editor = useTemplateRef('editor')

async function handleSave() {
  if (!store.selected) {
    toast.error('请选择编辑类型')
    return
  }
  
  const html = editor.value!.getHtml()

  if (store.selected.startsWith('service')) {
    const isEn = store.selected.endsWith('en')
    const id = route.query.id as string

    await updateService({
      packageId: Number(id),
      mustRead: isEn ? undefined : html,
      mustReadLocal: isEn ? html : undefined,
    })
  }
  else {
    await updateSetting([
      { name: store.selected, content: html },
    ])
  }

  toast.success('保存成功')
}

function handlePreview() {
  store.result = editor.value!.getHtml()
}
</script>

<template>
  <SplitPlane>
    <template #left>
      <TheEditor ref="editor" />
    </template>
    <template #right>
      <div class="p-3">
        <div class="flex items-center justify-between">
          <XSelect
            v-model="store.selected"
            ui-trigger="w-48"
            placeholder="选择编辑类型"
          >
            <XSelectItem
              v-for="item in options" :key="item.value"
              :value="item.value" :label="item.label"
            />
          </XSelect>

          <div class="space-x-2">
            <XButton label="预览" color="success" @click="handlePreview" />
            <XButton label="保存" @click="handleSave" />
          </div>
        </div>

        <div class="mt-6">
          <h2 class="text-xl font-bold mb-3">预览</h2>
          <div
            class="h-[calc(100vh-11rem)] p-4 overflow-y-auto border rounded"
            v-html="store.result"
          />
        </div>
      </div>
    </template>
  </SplitPlane>
</template>

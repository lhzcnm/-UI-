<script setup lang="ts">
import TheEditor from './components/TheEditor.vue'

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
  { label: '滑动公告', value: 'scrolling' },
  { label: '弹窗公告', value: 'popup' },
  { label: '充值说明', value: 'recharge' },
]

function handleSave() {
  console.log(store.selected)
}
</script>

<template>
  <SplitPlane>
    <template #left>
      <TheEditor />
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

          <XButton label="保存" @click="handleSave" />
        </div>

        <div class="mt-6">
          <h2 class="text-xl font-bold mb-3">预览</h2>
          <div class="h-[calc(100vh-11rem)] p-4 overflow-y-auto border rounded" />
        </div>
      </div>
    </template>
  </SplitPlane>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface TextColorPickerProps {
  editor: any
}

const props = defineProps<TextColorPickerProps>()
const openColor = ref(false)

const colorList = [
  // 红色系
  [
    { label: '浅红', value: '#fee2e2' },
    { label: '红色', value: '#fca5a5' },
    { label: '深红', value: '#dc2626' },
    { label: '暗红', value: '#991b1b' },
  ],
  // 橙色系
  [
    { label: '浅橙', value: '#fed7aa' },
    { label: '橙色', value: '#fb923c' },
    { label: '深橙', value: '#ea580c' },
    { label: '暗橙', value: '#c2410c' },
  ],
  // 黄色系
  [
    { label: '浅黄', value: '#fef3c7' },
    { label: '黄色', value: '#fbbf24' },
    { label: '深黄', value: '#d97706' },
    { label: '暗黄', value: '#92400e' },
  ],
  // 绿色系
  [
    { label: '浅绿', value: '#dcfce7' },
    { label: '绿色', value: '#4ade80' },
    { label: '深绿', value: '#16a34a' },
    { label: '暗绿', value: '#166534' },
  ],
  // 蓝色系
  [
    { label: '浅蓝', value: '#dbeafe' },
    { label: '蓝色', value: '#60a5fa' },
    { label: '深蓝', value: '#2563eb' },
    { label: '暗蓝', value: '#1e40af' },
  ],
  // 紫色系
  [
    { label: '浅紫', value: '#e9d5ff' },
    { label: '紫色', value: '#a855f7' },
    { label: '深紫', value: '#9333ea' },
    { label: '暗紫', value: '#6b21a8' },
  ],
  // 灰色系
  [
    { label: '浅灰', value: '#f3f4f6' },
    { label: '灰色', value: '#9ca3af' },
    { label: '深灰', value: '#4b5563' },
    { label: '暗灰', value: '#1f2937' },
  ],
  // 特殊颜色
  [
    { label: '粉色', value: '#f472b6' },
    { label: '青色', value: '#06b6d4' },
    { label: '靛蓝', value: '#6366f1' },
    { label: '黑色', value: '#000000' },
  ],
]

function handleColor(event: Event) {
  const target = event.target as HTMLButtonElement
  const element = target.closest('[data-value]')!
  const color = element.getAttribute('data-value')!

  props.editor.chain().focus()
    .setMark('textStyle', {color}).run()
}
</script>

<template>
  <XPopover
    v-model="openColor"
    closeOnClickOutside
    trigger="click"
  >
    <template #trigger>
      <button class="hover:bg-muted rounded px-1.5 py-1">
        <Icon icon="iconoir:color-picker" class="size-5" />
      </button>
    </template>

    <div class="w-48 space-y-2 p-2" @click="handleColor">
      <div 
        v-for="(colorGroup, index) in colorList"  :key="index"
        class="grid grid-cols-4 gap-1"
      >
        <button
          v-for="color in colorGroup" :key="color.value"
          :data-value="color.value" :title="color.label"
          class="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors flex-shrink-0"
          :style="{backgroundColor: color.value}"
        />
      </div>
    </div>
  </XPopover>
</template>

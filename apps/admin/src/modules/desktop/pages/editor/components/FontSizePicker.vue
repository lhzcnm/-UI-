<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { Icon } from '@iconify/vue'

interface FontSizePickerProps {
  editor: Editor
}

const props = defineProps<FontSizePickerProps>()
const openFontSize = ref(false)

const fontSizeList = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px(默认)', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '22px', value: '22px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
]

function handleFontSize(event: Event) {
  const target = event.target as HTMLButtonElement
  const element = target.closest('[data-value]')!
  const fontSize = element.getAttribute('data-value')!

  props.editor.chain().focus()
    .setMark('textStyle', {fontSize}).run()
}
</script>

<template>
  <XPopover
    v-model="openFontSize"
    closeOnClickOutside
    trigger="click"
  >
    <template #trigger>
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        :class="editor.isActive('textStyle') && 'bg-muted'"
      >
        <Icon icon="iconoir:text-size" class="size-5" />
      </button>
    </template>

    <div class="w-32 p-1" @click="handleFontSize">
      <button
        v-for="item in fontSizeList" :key="item.value"
        :data-value="item.value"
        :class="[
          'flex items-center w-full text-sm',
          'rounded px-2 py-1 hover:bg-muted transition-colors',
          editor.isActive('textStyle', {fontSize: item.value})
        ]"
      >
        <span>{{ item.label }}</span>
        <Icon 
          icon="lucide:check" class="inline-block size-4 ml-auto opacity-0 transition-opacity"
          :class="{'opacity-100': editor.isActive('textStyle', {fontSize: item.value})}"
        />
      </button>
    </div>
  </XPopover>
</template>

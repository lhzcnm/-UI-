<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface HeadingPickerProps {
  editor: any
}

const props = defineProps<HeadingPickerProps>()
const openHeading = ref(false)

const headingList = [
  { label: '一级标题', value: 2 },
  { label: '二级标题', value: 3 },
  { label: '三级标题', value: 4 },
]

function handleHeading(event: Event) {
  const target = event.target as HTMLButtonElement
  const element = target.closest('[data-value]')!
  const heading = element.getAttribute('data-value')!

  props.editor.chain().focus()
    .toggleHeading({level: Number(heading) as any}).run()
}
</script>

<template>
  <XPopover
    v-model="openHeading"
    closeOnClickOutside
    trigger="click"
  >
    <template #trigger>
      <button class="hover:bg-muted rounded px-1.5 py-1">
        <Icon icon="lucide:heading" class="size-5" />
      </button>
    </template>

    <div class="w-28 p-1" @click="handleHeading">
      <button
        v-for="item in headingList" :key="item.value"
        :data-value="item.value"
        :class="[
          'flex items-center w-full text-sm',
          'rounded px-2 py-1 hover:bg-muted transition-colors',
          editor?.isActive('heading', {level: item.value})
        ]"
      >
        <span>{{ item.label }}</span>
        <Icon 
          icon="lucide:check" class="inline-block size-4 ml-auto opacity-0 transition-opacity"
          :class="{'opacity-100': editor?.isActive('heading', {level: item.value})}"
        />
      </button>
    </div>
  </XPopover>
</template>

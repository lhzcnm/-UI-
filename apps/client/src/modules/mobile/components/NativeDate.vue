<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'
import { ref, computed } from 'vue'

interface NativeDateProps {
  placeholder?: string
  class?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<NativeDateProps>(),
  {
    class: '',
    disabled: false,
    placeholder: '请选择日期',
  },
)

const value = defineModel<string>({ default: '' })
const inputRef = ref<HTMLInputElement | null>(null)

const displayValue = computed(() => {
  if (!value.value) return ''
  return new Date(value.value).toLocaleDateString('zh-CN')
})

function handleClick() {
  if (!props.disabled && inputRef.value) {
    inputRef.value.showPicker()
  }
}
</script>

<template>
  <div class="relative w-full">
    <input
      ref="inputRef"
      v-model="value"
      :disabled="disabled" type="date"
      class="absolute top-0 bottom-0 left-0 right-0 opacity-0 cursor-pointer"
    />

    <div
      :class="twMerge(
        'flex items-center justify-between w-full h-10 px-3 ',
        'bg-transparent rounded ring-1 ring-input hover:ring-hover',
        'focus-within:ring-2 focus-within:ring-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        'transition-all duration-200',
        props.class,
      )"
      @click="handleClick"
    >
      <span
        :class="twMerge(
          'flex-1 truncate text-sm',
          !value && 'text-muted-foreground',
        )"
      >
        {{ displayValue || placeholder }}
      </span>
      <Icon
        icon="lucide:calendar"
        class="flex-shrink-0 size-4 text-muted-foreground"
      />
    </div>
  </div>
</template>

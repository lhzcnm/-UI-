<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { XPopover } from '../popover'

import type { XSelectProps, XSelectEmits, Option } from './select'
import { XSELECT_CONTEXT } from './select'
import { twMerge } from 'tailwind-merge'

defineOptions({ name: 'XSelect' })

const props = withDefaults(
  defineProps<XSelectProps>(),
  {
    filterable: false,
    inputPlaceholder: '请输入',
    placeholder: '请选择',
    placement: 'bottom',
  }
)

const emits = defineEmits<XSelectEmits>()
const input = defineModel<string>('input', { default: '' })
const model = defineModel<string | number>()

const open = ref(false)
const options = ref<Option[]>([])

const displayText = computed(() => {
  const finded = options.value.findIndex(option =>
    option.value === model.value
  )

  if (finded === -1) return props.placeholder
  return options.value[finded].label
})

provide(XSELECT_CONTEXT, { model, options })

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const element = target.closest('[data-value]')
  if (!element) return

  let value = element.getAttribute('data-value') as any
  if (typeof model.value === 'number' && !isNaN(Number(value))) value = Number(value)
  else value = value as string

  emits('selected', value)
  model.value = value
  open.value = false
}
</script>

<template>
  <XPopover
    v-model="open"
    :placement="placement"
    closeOnClickOutside
  >
    <template #trigger>
      <button
        v-bind="$attrs"
        :style="{ width }"
        :class="twMerge(
          'flex items-center justify-between space-x-2 shadow-sm',
          'w-56 h-10 sm:h-9 px-3 bg-card text-sm text-foreground',
          'border hover:border-hover rounded-md transition-colors',
        )"
      >
        <span class="truncate">{{ displayText }}</span>
        <Icon icon="lucide:chevron-down" class="flex-shrink-0 size-4" />
      </button>
    </template>

    <div
      :style="{ width }"
      :class="[
        'flex flex-col',
        !width && 'min-w-56',
      ]"
    >
      <div
        v-if="props.filterable"
        class="relative flex items-center space-x-2 py-2 px-3 border-b"
      >
        <Icon icon="lucide:search" class="size-4 text-muted-foreground" />
        <input
          v-model="input"
          autofocus type="text"
          class="flex-1 text-sm bg-transparent border-none outline-0 focus:outline-none"
          :placeholder="inputPlaceholder"
        >
      </div>
      <div
        class="flex flex-col space-y-1 p-1.5 max-h-96 overflow-y-auto"
        @click="handleClick"
      >
        <slot>
          <div
            :class="twMerge(
              'flex items-center justify-center',
              'h-10 text-sm text-muted-foreground'
            )"
          >
            空空如也
          </div>
        </slot>
      </div>
    </div>
  </XPopover>
</template>

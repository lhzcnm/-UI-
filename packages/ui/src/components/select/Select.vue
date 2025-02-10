<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { XPopover } from '../popover'
import { XInput } from '../input'

import type { XSelectProps, XSelectEmits, Option } from './select'
import { XSelectKey } from './select'
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
const model = defineModel<any>()

const open = ref(false)
const options = ref<Option[]>([])
const displayText = computed(() => {
  const finded = options.value.findIndex(option =>
    option.value === model.value
  )
  
  if (finded === -1) return props.placeholder
  return options.value[finded].label
})

provide(XSelectKey, {
  model,
  options,
  handleClick: (value: any) => {
    emits('selected', value)
    model.value = value
    open.value = false
  },
})
</script>

<template>
  <XPopover
    v-model="open"
    :placement="placement"
    closeOnClickOutside
  >
    <template #trigger>
      <button
        :class="twMerge(
          'flex items-center justify-between gap-2',
          'w-56 h-10 sm:h-9 px-3 bg-card text-sm text-foreground',
          'border hover:border-hover rounded-md shadow-sm transition-colors',
        )"
        :style="{ width }"
        v-bind="$attrs"
      >
        <span class="truncate">{{ displayText }}</span>
        <Icon icon="lucide:chevron-down" class="flex-shrink-0 size-4" />
      </button>
    </template>

    <div
      :class="twMerge(
        'flex flex-col',
        'bg-card border rounded-md shadow',
        !width && 'min-w-56',
      )"
      :style="{ width }"
    >
      <div v-if="props.filterable" class="p-2">
        <XInput
          v-model="input" autofocus
          :placeholder="inputPlaceholder"
        />
      </div>
      <div class="flex flex-col gap-1 p-2 max-h-96 overflow-y-auto">
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

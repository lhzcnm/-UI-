<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

interface NativeSelectProps {
  options: any[]
  valueKey: string
  labelKey: string
  disabled?: boolean
  placeholder?: string
  default?: string | number
  class?: string
}

interface NativeSelectEmits {
  (e: 'change', value: string | number): void
}

const props = withDefaults(
  defineProps<NativeSelectProps>(),
  { default: 0 },
)

const selected = defineModel<string | number>({ default: '' })
const emit = defineEmits<NativeSelectEmits>()

function handleChange() {
  emit('change', selected.value)
}
</script>

<template>
  <div class="relative w-full">
    <Icon 
      icon="lucide:chevron-down" :width="20"
      :class="twMerge(
        'absolute right-2 top-1/2 transform -translate-y-1/2',
        'pointer-events-none text-muted-foreground bg-card',
        disabled ? 'opacity-50' : '',
      )"
    />

    <select
      v-model="selected"
      :class="twMerge(
        'w-full h-10 px-2 bg-card rounded appearance-none overflow-hidden',
        'border-r-8 border-r-transparent ring-1 ring-input',
        'outline-none focus:ring-primary disabled:opacity-50',
        props.class
      )"
      :disabled="disabled"
      @change="handleChange"
    >
      <option
        v-if="placeholder"
        :value="default" class="bg-card"
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="option[valueKey]"
        :value="option[valueKey]"
        class="bg-card"
      >
        {{ option[labelKey] }}
      </option>
    </select>
  </div>
</template>

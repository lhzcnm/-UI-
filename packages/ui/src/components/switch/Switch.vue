<script setup lang="ts">
import { twJoin } from 'tailwind-merge'

interface SwitchProps {
  label?: string
}

interface SwitchEmits {
  (e: 'change', value: boolean): void
}

defineOptions({ name: 'XSwitch' })

defineProps<SwitchProps>()
const emit = defineEmits<SwitchEmits>()
const toggle = defineModel<boolean>({ default: false })

const id = useId()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('change', target.checked)
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()

    const checkbox = document.getElementById(id) as HTMLInputElement
    if (!checkbox) return

    checkbox.checked = !checkbox.checked
    toggle.value = checkbox.checked
    emit('change', checkbox.checked)
  }
}
</script>

<template>
  <label 
    :for="id" 
    :class="twJoin(
      'relative inline-flex items-center',
      'whitespace-nowrap cursor-pointer',
    )"
    :aria-checked="toggle"
    tabindex="0" role="switch"
    @keydown="handleKeyDown"
  >
    <input
      v-model="toggle"
      :id="id"
      type="checkbox"
      tabindex="-1"
      class="sr-only peer"
      @change="handleChange"
    />
    <div
      :class="twJoin(
        'w-11 h-6 bg-zinc-200 rounded-full peer dark:bg-zinc-700',
        'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-primary',
        'after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300',
        'after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 ',
      )"
    />
    <span class="inline-block ml-2 text-sm text-muted-foreground">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

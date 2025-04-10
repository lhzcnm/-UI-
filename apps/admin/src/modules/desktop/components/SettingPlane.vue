<script setup lang="ts">
import { twJoin } from 'tailwind-merge'

const visible = defineModel<boolean>({ required: true })
const tab = ref('routine')

const options = [
  { label: '常规', value: 'routine' },
  { label: '主题', value: 'theme' },
]
</script>

<template>
  <XDialog
    v-model="visible" title="设置"
    content-class="sm:max-w-2xl"
  >
    <div class="w-32 h-96">
      <ul class="space-y-1">
        <li v-for="item in options" :key="item.value">
          <button
            :class="twJoin(
              'flex items-center justify-between w-full px-3 h-10 sm:h-8',
              'rounded-md hover:bg-muted hover:text-accent-foreground',
              tab === item.value && 'bg-muted text-accent-foreground',
            )"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </XDialog>
</template>

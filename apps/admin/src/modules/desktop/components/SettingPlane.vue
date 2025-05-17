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
    uiRoot="sm:max-w-2xl"
  >
    <div class="w-32 h-96">
      <ul class="space-y-1">
        <li v-for="item in options" :key="item.value">
          <button
            :class="twJoin(
              'flex items-center justify-between w-full px-2 h-10 sm:h-8',
              'rounded-md hover:bg-primary/20 transition-colors',
              tab === item.value && 'bg-primary/20 text-primary hover:bg-primary/20',
            )"
          >
            {{ item.label }}
          </button>
        </li>
      </ul>
    </div>
  </XDialog>
</template>

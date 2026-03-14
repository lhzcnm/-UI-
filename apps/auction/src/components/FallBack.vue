<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { tv } from 'tailwind-variants'

const style = tv({
  slots: {
    root: [
      'flex items-center justify-center flex-col h-[50vh] text-6xl text-muted-foreground',
    ],
    text: 'text-base mt-3'
  }
})

const b = style()
</script>

<template>
  <div :class="b.root()">
    <Icon icon="svg-spinners:pulse-multiple" />
    <span :class="b.text()">loading...</span>
  </div>
</template>

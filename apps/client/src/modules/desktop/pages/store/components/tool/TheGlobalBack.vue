<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { tv } from 'tailwind-variants'
import { TOOL_STORE, ToolStatus } from '@desktop/pages/store/utils/symbol'

interface TheGlobalBackProps {
  name: string,
}

defineProps<TheGlobalBackProps>()

const store = inject(TOOL_STORE)!

const style = tv({
  base: [
    'h-16 w-full pl-2 space-x-2',
    'flex items-center'
  ]
})

function handleClick() {
  store.toolStatus = ToolStatus.ROOT
}
</script>

<template>
  <button
    :class="style()" @click="handleClick">
    <Icon icon="lucide:chevron-left" class="size-12" />
    <span class="text-xl">{{ name }}</span>
  </button>
</template>

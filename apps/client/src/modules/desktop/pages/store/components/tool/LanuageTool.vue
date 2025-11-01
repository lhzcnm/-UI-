<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/store/utils/types'
import { TOOL_STORE, ToolStatus } from '@desktop/pages/store/utils/symbol'

interface LanuageToolProps extends ToolGlobalProps {}

const store = inject(TOOL_STORE)!

const props = defineProps<LanuageToolProps>()

function handleClick() {
  store.toolStatus = ToolStatus.LANGUAGE
}
</script>

<template>
  <button
    :class="props.class"
    @click="handleClick"
  >
    <Icon
      icon="lucide:languages"
      class="size-10 text-primary"
    />
    <span>切换语言</span>
  </button>
</template>

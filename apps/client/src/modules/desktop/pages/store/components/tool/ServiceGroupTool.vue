<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/store/utils/types'
import { SERVICE_STORE, TOOL_STORE, ToolStatus } from '@desktop/pages/store/utils/symbol'

interface ServiceGroupToolProps extends ToolGlobalProps {}

const store = inject(TOOL_STORE)!
const serviceStore = inject(SERVICE_STORE)!

defineProps<ServiceGroupToolProps>()

function handleClick() {
  store.toolStatus = ToolStatus.GROUP
  serviceStore.storeStatus = 'serviceStore'
}
</script>

<template>
  <button
    :class="class"
    @click="handleClick"
  >
    <Icon
      icon="streamline-ultimate-color:server-refresh-1"
      class="size-10 text-primary"
    />
    <span>服务组</span>
  </button>
</template>

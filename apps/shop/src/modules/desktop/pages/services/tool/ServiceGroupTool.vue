<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/services/utils/types'
import { TOOL_STORE, ToolStatus } from '../utils'

interface ServiceGroupToolProps extends ToolGlobalProps {}

const { t } = useI18n()

const store = inject(TOOL_STORE)!

const props = defineProps<ServiceGroupToolProps>()

function handleClick() {
  store.toolStatus = ToolStatus.GROUP
}
</script>

<template>
  <button
    :class="props.class"
    @click="handleClick"
  >
    <Icon
      icon="streamline-ultimate-color:server-refresh-1"
      class="size-10 text-primary"
    />
    <span>{{ t('shop.tool.name.group') }}</span>
  </button>
</template>

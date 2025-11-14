<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/store/utils/types'
import { TOOL_STORE, ToolStatus } from '@desktop/pages/store/utils/symbol'

interface OrderSearchToolProps extends ToolGlobalProps {}

const { t } = useI18n()

const props = defineProps<OrderSearchToolProps>()

const store = inject(TOOL_STORE)!

function handleClick() {
  store.toolStatus = ToolStatus.ORDER
}
</script>

<template>
  <button
    :class="props.class"
    @click="handleClick"
  >
    <Icon
      icon="streamline-ultimate-color:book-search"
      class="size-10 text-primary"
    />
    <span>{{ t('store.tool.name.order') }}</span>
  </button>
</template>

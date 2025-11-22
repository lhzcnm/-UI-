<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/services/utils/types'
import { TOOL_STORE, ToolStatus } from '../utils';

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
    <span>{{ t('shop.tool.name.order') }}</span>
  </button>
</template>

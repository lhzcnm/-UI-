<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/services/utils/types'
import { TOOL_STORE, ToolStatus } from '../utils'

interface LanuageToolProps extends ToolGlobalProps {}

const { t } = useI18n()

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
    <span>{{ t('shop.tool.name.lang') }}</span>
  </button>
</template>

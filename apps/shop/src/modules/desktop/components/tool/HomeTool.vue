<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from "@/inters/tool"

interface HomeToolProps extends ToolGlobalProps {}

const { t } = useI18n()

const props = defineProps<HomeToolProps>()

function handleClick() {
  location.href = '/store'
}
</script>

<template>
  <button
    :class="props.class"
    @click="handleClick"
  >
    <Icon
      icon="streamline-ultimate-color:single-woman-home"
      class="size-10 text-primary"
    />
    <span>{{ t('shop.tool.name.home') }}</span>
  </button>
</template>

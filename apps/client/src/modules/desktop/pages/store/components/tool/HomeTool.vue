<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/store/utils/types'

interface HomeToolProps extends ToolGlobalProps {}

const { t } = useI18n()

const props = defineProps<HomeToolProps>()

const router = useRouter()

function handleClick() {
  router.push('/')
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
    <span>{{ t('store.tool.name.home') }}</span>
  </button>
</template>

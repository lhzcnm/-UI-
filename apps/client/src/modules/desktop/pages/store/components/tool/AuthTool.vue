<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/store/utils/types'

interface AuthToolProps extends ToolGlobalProps {}

const { t } = useI18n()

const props = defineProps<AuthToolProps>()

// const router = useRouter()

function handleClick() {
  const authKey = import.meta.env.VITE_ACCESS_TOKEN
  localStorage.removeItem(authKey)
  location.href = "/"
}
</script>

<template>
  <button
    :class="props.class"
    @click="handleClick"
  >
    <Icon
      icon="streamline-ultimate-color:login-key"
      class="size-10 text-primary"
    />
    <span>{{ t('store.tool.name.auth') }}</span>
  </button>
</template>

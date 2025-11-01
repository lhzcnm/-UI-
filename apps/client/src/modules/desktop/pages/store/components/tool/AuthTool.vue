<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { ToolGlobalProps } from '@desktop/pages/store/utils/types'

interface AuthToolProps extends ToolGlobalProps {}

const props = defineProps<AuthToolProps>()

const router = useRouter()

function handleClick() {
  localStorage.clear()
  router.push('/auth')
  location.reload()
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
    <span>会员登录</span>
  </button>
</template>

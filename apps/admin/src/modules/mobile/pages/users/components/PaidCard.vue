<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { UserPaid } from '@/inters/users'

interface TheProps {
  index: number
  user: UserPaid
}

const props = defineProps<TheProps>()

const headImgUrl = computed(() => {
  if (props.user.headImgUrl) {
    return props.user.headImgUrl
  }

  const mode = import.meta.env.VITE_APP_MODE
  return `/${mode}/default_avatar.jpg`
})
</script>

<template>
  <button class="w-full p-4 text-left bg-card border rounded-lg overflow-hidden shadow-sm">
    <div class="flex justify-between">
      <div class="flex items-center space-x-2">
        <img :src="headImgUrl" alt="Avatar" class="size-8 rounded">
        <span class="flex-1 min-w-0 truncate font-medium">{{ user.nickName || user.userName }}</span>
      </div>

      <div class="flex items-center space-x-1 bg-muted rounded px-2 py-0.5 text-muted-foreground">
        <Icon icon="lucide:credit-card" class="size-5" />
        <span class="text-sm font-semibold">{{ user.credits }}</span>
      </div>
    </div>

    <div class="mt-2 text-sm text-muted-foreground">
      <span>ID {{ user.userId }}</span> ·
      <span>包月会员</span>
    </div>

    <div class="mt-1 space-y-1 text-sm">
      <p>微信ID: {{ user.weixinOpenId || '未绑定' }}</p>
      <p>会员到期: {{ user.memberExp }}</p>
    </div>
  </button>
</template>

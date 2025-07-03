<script setup lang="ts">
import type { User } from '@/inters/users'
import { twJoin } from 'tailwind-merge';

interface TheProps {
  index: number
  user: User
}

const props = defineProps<TheProps>()

const levelStore = useLevelStore()

const headImgUrl = computed(() => {
  if (props.user.headImgUrl) {
    return props.user.headImgUrl
  }

  const mode = import.meta.env.VITE_APP_MODE
  return `/${mode}/default_avatar.jpg`
})
</script>

<template>
  <div 
    :class="twJoin(
      'p-4 bg-card border rounded-lg',
    )"
  >
    {{ user.userName }}
  </div>
</template>

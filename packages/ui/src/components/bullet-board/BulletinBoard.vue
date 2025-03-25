<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

interface BulletinBoardProps {
  text: string
}

defineOptions({ name: 'XBulletinBoard' })
defineProps<BulletinBoardProps>()
</script>

<template>
  <section class="relative w-full p-2 bg-card overflow-hidden border rounded-md">
    <div
      :class="twJoin(
        'absolute top-0 left-0 z-10',
        'flex items-center justify-center h-full w-12',
        'bg-gradient-to-r from-card from-80%',
        'to-[rgba(255,255,255,0)] dark:to-[rgba(27,28,34,0.1)] rounded-lg'
      )"
    >
      <Icon icon="hugeicons:megaphone-02" class="align-middle size-5" />
    </div>
    <div
      class="inline-flex space-x-3 pl-[100%] whitespace-nowrap animate-bulletin-scroll"
      v-html="text"
    />
  </section>
</template>

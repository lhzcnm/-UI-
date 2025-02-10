<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

interface BulletinBoardProps {
  text: string
}

defineOptions({ name: 'BulletinBoard' })
defineProps<BulletinBoardProps>()
</script>

<template>
  <section
    class="relative w-full p-2 overflow-hidden border rounded-md"
  >
    <div
      :class="twMerge(
        'absolute top-0 left-0 z-10 flex items-center justify-center h-full w-12',
        'bg-gradient-to-r from-background from-80% to-transparent'
      )"
    >
      <Icon icon="hugeicons:megaphone-02" class="align-middle" />
    </div>
    <div
      class="inline-flex gap-3 pl-[100%] whitespace-nowrap animate-bulletin-scroll"
      v-html="text"
    />
  </section>
</template>

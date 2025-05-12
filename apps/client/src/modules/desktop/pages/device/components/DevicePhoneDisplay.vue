<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { tv } from 'tailwind-variants'

const b = tv({
  base: [
    'inline-flex items-center space-x-1.5',
    'hover:text-foreground transition-colors',
  ],
})

const currentTime = ref(getCurrentTime())
const currentDate = ref(getCurrentDate())

function getCurrentTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

function getCurrentDate() {
  const now = new Date()
  const day = now.getDate()
  const month = now.getMonth() + 1
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()]
  
  return `${month}月${day}日 星期${weekday}`
}

function handleRestart() {
  console.log('Restarting device...')
}

function handleShutdown() {
  console.log('Shutting down device...')
}

function handleRefresh() {
  console.log('Refreshing device info...')
}
</script>

<template>
  <div class="w-96 py-4 pr-4">
    <div class="relative max-w-xs h-[605px] mx-auto">
      <img src="/images/device.png" alt="Device Mockup" class="absolute z-10 size-full">
      <div class="relative size-full px-4 py-3.5">
        <div class="relative size-full rounded bg-gradient-to-br from-green-400 via-blue-500 to-rose-400"></div>
        <div class="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold">{{ currentTime }}</div>
        <div class="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-white text-sm">{{ currentDate }}</div>
      </div>
    </div>

    <div class="flex justify-center space-x-4 mt-3 text-muted-foreground">
      <button :class="b()" @click="handleRestart">
        <Icon icon="lucide:rotate-cw" />
        <span>重启</span>
      </button>
      <button :class="b()" @click="handleShutdown">
        <Icon icon="lucide:power" />
        <span>关机</span>
      </button>
      <button :class="b()" @click="handleRefresh">
        <Icon icon="lucide:refresh-ccw" />
        <span>刷新</span>
      </button>
    </div>
  </div>
</template>

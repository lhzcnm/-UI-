<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface DevicePhoneDisplayProps {
  time: string
  date: string
}

defineProps<DevicePhoneDisplayProps>()

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
  <div class="w-96 p-4">
    <div class="relative max-w-xs mx-auto">
      <div class="relative rounded-3xl overflow-hidden border-8 border-black h-[600px] bg-gradient-to-br from-green-400 via-blue-500 to-rose-400">
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-black rounded-b-2xl"></div>
        <div class="phone-time absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold">{{ time }}</div>
        <div class="phone-date absolute top-1/3 left-1/2 transform -translate-x-1/2 text-white text-sm">{{ date }}</div>
      </div>
    </div>

    <div class="flex justify-center mt-4 divide-x">
      <button class="px-3 text-muted-foreground flex items-center" @click="handleRestart">
        <Icon icon="lucide:rotate-cw" class="mr-1" /> 重启
      </button>
      <button class="px-3 text-muted-foreground flex items-center" @click="handleShutdown">
        <Icon icon="lucide:power" class="mr-1" /> 关机
      </button>
      <button class="px-3 text-muted-foreground flex items-center" @click="handleRefresh">
        <Icon icon="lucide:refresh-ccw" class="mr-1" /> 刷新
      </button>
    </div>
  </div>
</template>

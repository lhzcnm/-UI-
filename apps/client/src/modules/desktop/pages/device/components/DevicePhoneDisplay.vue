<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { tv } from 'tailwind-variants'
import { useThrottleFn } from '@vueuse/core'

import { STORE } from '../utils'
import { wsFetch } from '../utils/websocket'

const b = tv({
  base: [
    'inline-flex items-center space-x-1.5',
    'hover:text-foreground transition-colors',
  ],
})

const currentTime = ref(getCurrentTime())
const currentDate = ref(getCurrentDate())

const store = inject(STORE)!

const deviceMockup = {
  iPhone8: {
    image: '/images/device_8p.png',
    imageHeight: '512px',
    imageRadius: 0,
    left: '17px',
    top: '59px',
    width: '222px',
    height: '393px',
  },
  iPhonex: {
    image: '/images/device_13pm.png',
    imageHeight: '516px',
    imageRadius: 0,
    left: '14px',
    top: '13px',
    width: '227px',
    height: '490px',
  },
  iPhone11: {
    image: '/images/device_14pm.png',
    imageHeight: '524px',
    imageRadius: '10px',
    left: '11px',
    top: '10px',
    width: '234px',
    height: '504px',
  },
}

const handleRefresh = useThrottleFn(onRefresh, 1000)
const handleRestart = useThrottleFn(onRestart, 1000)
const handleShutdown = useThrottleFn(onShutdown, 1000)

const deviceImage = computed(() => {
  const { product } = store.deviceMap.get(store.selected)!
  const matched = product ? product.Name.match(/^iPhone (\d+)/) : null
  return deviceMockup[getDeviceType(matched)]
})

function getDeviceType(matched: RegExpMatchArray | null) {
  if (matched && Number(matched[1]) <= 8) return 'iPhone8'
  if (matched && Number(matched[1]) >= 11) return 'iPhone11'

  return 'iPhonex'
}

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

async function onRestart() {
  const [_, uniqueId] = store.selected.split(':')
  await wsFetch({ type: 'reboot', Uid: uniqueId })
}

async function onShutdown() {
  const [_, uniqueId] = store.selected.split(':')
  await wsFetch({ type: 'shutdown', Uid: uniqueId })
}

async function onRefresh() {
  const [_, uniqueId] = store.selected.split(':')
  const response = await wsFetch<string>({
    type: 'screenshot',
    Uid: uniqueId,
  })

  store.screenshot = `data:image/png;base64,${response}`
}
</script>

<template>
  <div class="w-96">
    <div
      class="relative w-64 mx-auto"
      :style="{ height: deviceImage.imageHeight }"
    >
      <img
        :src="deviceImage.image" alt="Device Mockup"
        class="absolute z-10 drop-shadow-2xl"
        draggable="false"
      >

      <div
        class="absolute overflow-hidden"
        :style="{
          left: deviceImage.left,
          top: deviceImage.top,
          width: deviceImage.width,
          height: deviceImage.height,
          borderRadius: deviceImage.imageRadius,
        }"
      >
        <img
          v-if="store.screenshot"
          :src="store.screenshot"
          alt="Device Screenshot"
          class="size-full"
          draggable="false"
          @error="store.screenshot = ''"
        >
        <template v-else>
          <div class="relative size-full rounded bg-gradient-to-br from-green-400 via-blue-500 to-rose-400"></div>
          <div class="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white text-3xl font-bold">{{ currentTime }}</div>
          <div class="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-white text-sm mt-2">{{ currentDate }}</div>
        </template>
      </div>
    </div>

    <div class="flex justify-center space-x-4 mt-6 text-muted-foreground">
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

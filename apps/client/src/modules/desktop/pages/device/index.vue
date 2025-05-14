<script setup lang="ts">
import DevicePhoneDisplay from './components/DevicePhoneDisplay.vue'
import DeviceInfoHeader from './components/DeviceInfoHeader.vue'
import DeviceInfoGrid from './components/DeviceInfoGrid.vue'
import DeviceBatteryInfo from './components/DeviceBatteryInfo.vue'
import DeviceDiskInfo from './components/DeviceDiskInfo.vue'
import DeviceAction from './components/DeviceAction.vue'

import { useWebSocket } from '@vueuse/core'
import { Icon } from '@iconify/vue'

import type { DeviceInfo } from './types'
import type { DeviceStore } from './utils'
import { DEVICE_STORE, ConnStatus, deviceConfig } from './utils'

const store = reactive<DeviceStore>({
  status: ConnStatus.IDLE,
  info: {} as DeviceInfo,
  screenshot: '',
  ws: null,
})

provide(DEVICE_STORE, store)
await getDeviceInfo()

async function getDeviceInfo() {
  try {
    await checkPlugin()
    const { data } = useWebSocket(deviceConfig.ws)

    watch(data, (value) => {
      if (value === 'disconnected') {
        store.status = ConnStatus.DISCONNECTED
        return
      }

      store.status = ConnStatus.CONNECTED
      store.info = JSON.parse(value)

      const response = fetch(`${deviceConfig.api}/screenshot`)
      response.then(async (res) => {
        const blob = await res.blob()
        store.screenshot = URL.createObjectURL(blob)
      })
    })
  }
  catch (error) {
    console.error(error)
    store.status = ConnStatus.PLUGIN_NOT_INSTALLED
  }
}

async function checkPlugin() {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 3000)
  await fetch(deviceConfig.api, {
    signal: controller.signal,
  })
}

function handleDownload() {}
</script>

<template>
  <div class="relative p-4 h-full">
    <div v-show="store.status === ConnStatus.CONNECTED" class="flex">
      <DevicePhoneDisplay />
  
      <div class="flex-1 py-4">
        <div class="overflow-hidden border rounded-lg mb-4">
          <DeviceInfoHeader />
          <DeviceInfoGrid />
        </div>
  
        <div class="flex flex-wrap space-x-4">
          <DeviceBatteryInfo />
          <DeviceDiskInfo />
          <DeviceAction />
        </div>

      </div>
    </div>

    <transition name="fade">
      <div
        v-if="store.status === ConnStatus.IDLE || store.status === ConnStatus.DISCONNECTED"
        class="absolute inset-0 z-50 flex items-center justify-center flex-col h-full bg-background"
      >
        <div class="relative -mt-72">
          <div class="absolute inset-0 animate-pulse bg-primary/10 rounded-full blur-xl"></div>
          <div class="relative border-2 border-dashed border-primary/30 rounded-full p-6 bg-background/50 backdrop-blur-sm">
            <Icon icon="lucide:unlink" class="text-7xl text-primary x-animate-bounce" />
          </div>
        </div>
        <div class="mt-12 text-center space-y-4">
          <h2 class="text-2xl font-semibold text-foreground">等待 iPhone 连接</h2>
          <p class="text-base text-muted-foreground max-w-md">
            请使用 USB 线连接 iPhone 到电脑<br>并确保已启用"信任此电脑"。
          </p>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="store.status === ConnStatus.PLUGIN_NOT_INSTALLED"
        class="absolute inset-0 z-50 flex items-center justify-center flex-col h-full bg-background"
      >
        <div class="relative -mt-72">
          <div class="absolute inset-0 animate-pulse bg-primary/10 rounded-full blur-xl"></div>
          <div class="relative border-2 border-dashed border-primary/30 rounded-full p-6 bg-background/50 backdrop-blur-sm">
            <Icon icon="lucide:shield-alert" class="text-7xl text-primary" />
          </div>
        </div>
        <div class="mt-12 text-center space-y-4">
          <h2 class="text-2xl font-semibold text-foreground">
            未检测到插件运行
          </h2>
          <p class="text-base text-muted-foreground max-w-md">
            如果插件未运行，请先启动插件，再刷新页面。<br>
            如果插件未安装，请点击下方按钮下载安装插件。
          </p>
          <XButton
            icon="lucide:arrow-down-to-line"
            @click="handleDownload"
          >
            下载插件
          </XButton>
        </div>
      </div>
    </transition>
  </div>
</template>

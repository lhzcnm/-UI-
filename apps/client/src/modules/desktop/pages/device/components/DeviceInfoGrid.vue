<script setup lang="ts">
import { DEVICE_STORE, deviceConfig } from '../utils'
import http from '@/utils/http'

import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { Icon } from '@iconify/vue'

const store = inject(DEVICE_STORE)!

const { copy, copied } = useClipboard()
const isActivated = ref(store.info.ActivationState === 'Activated')
watch(copied, (val) => val && toast.success('复制成功'))

const loadings = reactive({
  networkLock: false,
  activationLock: false,
})

const queryStore = reactive({
  networkLock: '--',
  activationLock: '--',
})

async function handleActivation() {
  const suffix = isActivated.value ? 'deactivate' : 'activation'
  await fetch(`${deviceConfig.api}/${suffix}`)
  isActivated.value = !isActivated.value
}

function handleNetworkLock() {
  loadings.networkLock = true
  const response = http.post('/device/query', {
    imei: store.info.InternationalMobileEquipmentIdentity,
    imei2: store.info.InternationalMobileEquipmentIdentity2,
    sn: store.info.SerialNumber,
    serviceId: 9999,
    type: 'NetworkLock',
  })

  response.then(({ data }) => {
    const status = data === 'ON' ? '开启' : '关闭'
    queryStore.networkLock = `${data} ${status}`
  })

  response.finally(() => {
    loadings.networkLock = false
  })
}

function handleActivationLock() {
  loadings.activationLock = true
  const response = http.post('/device/query', {
    imei: store.info.InternationalMobileEquipmentIdentity,
    imei2: store.info.InternationalMobileEquipmentIdentity2,
    sn: store.info.SerialNumber,
    serviceId: 8888,
    type: 'ActivationLock',
  })

  response.then(({ data }) => {
    const status = data === 'ON' ? '开启' : '关闭'
    queryStore.activationLock = `${data} ${status}`
  })

  response.finally(() => {
    loadings.activationLock = false
  })
}
</script>

<template>
  <div class="grid grid-cols-2 gap-12 p-4 bg-card">
    <div class="space-y-1 whitespace-nowrap">
      <div>
        <span class="inline-block w-20 text-muted-foreground">序列号</span>
        <span class="cursor-pointer hover:text-primary" @click="copy(store.info.SerialNumber)">
          {{ store.info.SerialNumber }}
        </span>
      </div>
      <div>
        <span class="inline-block w-20 text-muted-foreground">串号</span>
        <span
          class="cursor-pointer hover:text-primary"
          @click="copy(store.info.InternationalMobileEquipmentIdentity)"
        >
          {{ store.info.InternationalMobileEquipmentIdentity }}
        </span>
      </div>
      <div>
        <span class="inline-block w-20 text-muted-foreground">型号号码</span>
        <span
          class="cursor-pointer hover:text-primary"
          @click="copy(`${store.info.ModelNumber} ${store.info.RegionInfo}`)"
        >
          {{ store.info.ModelNumber }} {{ store.info.RegionInfo }}
        </span>
      </div>
      <div>
        <span class="inline-block w-20 text-muted-foreground">主板序号</span>
        <span
          class="cursor-pointer hover:text-primary"
          @click="copy(store.info.WirelessBoardSerialNumber)"
        >
          {{ store.info.WirelessBoardSerialNumber }}
        </span>
      </div>
      <div>
        <span class="inline-block w-20 text-muted-foreground">系统版本</span>
        <span
          class="cursor-pointer hover:text-primary"
          @click="copy(`${store.info.ProductVersion} (${store.info.BuildVersion})`)"
        >
          {{ store.info.ProductVersion }} ({{ store.info.BuildVersion }})
        </span>
      </div>
      <div>
        <span class="inline-block w-20 text-muted-foreground">ECID</span>
        <span
          class="cursor-pointer hover:text-primary"
          @click="copy(store.info.UniqueChipID.toString())"
        >
          {{ store.info.UniqueChipID }}
        </span>
      </div>
      <div>
        <span class="inline-block w-20 text-muted-foreground">UDID</span>
        <span
          class="cursor-pointer hover:text-primary"
          @click="copy(store.info.UniqueDeviceID)"
        >
          {{ store.info.UniqueDeviceID }}
        </span>
      </div>
    </div>

    <div class="space-y-1 whitespace-nowrap">
      <div class="flex items-center">
        <span class="inline-block w-20 text-muted-foreground">激活状态</span>
        <div class="flex-1 flex items-center justify-between">
          <span>{{ isActivated ? '已激活' : '未激活' }}</span>
          <button class="ml-2 text-primary" @click="handleActivation">
            {{ isActivated ? '反激活' : '激活' }}
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span class="inline-block w-20 text-muted-foreground">网络锁</span>
        <div class="flex-1 flex items-center justify-between">
          <span>{{ queryStore.networkLock }}</span>
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary"
            :disabled="loadings.networkLock"
            @click="handleNetworkLock"
          >
            <Icon v-if="loadings.networkLock" icon="lucide:loader-2" class="animate-spin" />
            <span>{{ loadings.networkLock ? '查询中...' : '立即查询' }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span class="inline-block w-20 text-muted-foreground">激活锁</span>
        <div class="flex-1 flex items-center justify-between">
          <span>{{ queryStore.activationLock }}</span>
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary"
            :disabled="loadings.activationLock"
            @click="handleActivationLock"
          >
            <Icon v-if="loadings.activationLock" icon="lucide:loader-2" class="animate-spin" />
            <span>{{ loadings.activationLock ? '查询中...' : '立即查询' }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span class="inline-block w-20 text-muted-foreground">保修期限</span>
        <div class="flex-1 flex items-center justify-between">
          <span>--</span>
          <button class="ml-2 text-primary">立即查询</button>
        </div>
      </div>
      <div class="flex items-center">
        <span class="inline-block w-20 text-muted-foreground">iCloud</span>
        <div class="flex-1 flex items-center justify-between">
          <span>{{ store.info.CloudBackupEnabled ? '已开启' : '未开启' }}</span>
        </div>
      </div>
      <div class="flex items-center">
        <span class="inline-block w-20 text-muted-foreground">CPU</span>
        <span
          class="cursor-pointer hover:text-primary"
          @click="copy(store.deviceChip.Chip)"
        >
          {{ store.deviceChip.Chip }}
        </span>
      </div>
    </div>
  </div>
</template>

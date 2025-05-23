<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

import { DEVICE_STORE, DEVICE_CONFIG } from '../utils'

const store = inject(DEVICE_STORE)!
const isRecoveryMode = ref(false)
const isPrinting = ref(false)

const { copy } = useClipboard({ legacy: true })

function handleRecoveryMode() {
  if (isRecoveryMode.value) handleExitRecoveryMode()
  else handleEnterRecoveryMode()
}

async function handleEnterRecoveryMode() {
  const [_, uniqueId] = store.selectedDevice.split(':')
  await fetch(`${DEVICE_CONFIG.api}/enterRecoveryMode/${uniqueId}`)
  isRecoveryMode.value = true
}

async function handleExitRecoveryMode() {
  const device = store.deviceMap.get(store.selectedDevice)!
  await fetch(`${DEVICE_CONFIG.api}/irecovery/${device.UniqueChipID}`)
  isRecoveryMode.value = false
}

function handleCopy() {
  const info = store.infoMap.get(store.selectedDevice)!
  const meta = [
    ['序列号', info.SerialNumber],
    ['串号', info.Imei],
    ['型号号码', `${info.ModelNumber} ${info.RegionInfo}`],
    ['主板序号', info.MLBSerialNumber],
    ['系统版本', `${info.ProductVersion} (${info.BuildVersion})`],
    ['ECID', info.UniqueChipID],
    ['UDID', info.UniqueDeviceID],
    ['激活状态', info.ActivationState],
    ['网络锁', info.NetworkLock],
    ['激活锁', info.ActivationLock],
    ['保修期限', '--'],
    ['iCloud', info.iCloud],
    ['CPU', info.CPU],
  ]

  copy(meta.map(([key, value]) => `${key}: ${value}`).join('\n'))
  toast.success('复制成功')
}

async function handlePrint() {
  isPrinting.value = true

  const device = store.deviceMap.get(store.selectedDevice)!
  const info = store.infoMap.get(store.selectedDevice)!
  const product = store.productMap.get(store.selectedDevice)!

  const response = await fetch(
    `${DEVICE_CONFIG.api}/print`,
    {
      method: 'POST',
      body: JSON.stringify({
        DeviceName: product.Name,
        Color: product.Color,
        Imei: info.Imei,
        MLBSerialNumber: info.MLBSerialNumber,
        ProductVersion: info.ProductVersion,
        RegionInfo: info.RegionInfo,
        ModelNumber: info.ModelNumber,
        TotalDiskCapacity: device.TotalDiskCapacity,
        NominalChargeCapacity: store.battery.NominalChargeCapacity,
        DesignCapacity: store.battery.DesignCapacity,
        CycleCount: store.battery.CycleCount,
      })
    }
  )

  const blob = await response.blob()
  window.open(URL.createObjectURL(blob), '_blank')
  isPrinting.value = false
}
</script>

<template>
  <div
    :class="twJoin(
      'flex justify-between items-center',
      'py-2 px-3 border-b border-dashed',
    )"
  >
    <div class="flex items-center space-x-2">
      <XSelect
        v-model="store.selectedDevice"
        placement="bottom-start"
        ui-trigger="w-44 sm:h-8"
      >
        <XSelectItem
          v-for="{ DeviceID, UniqueDeviceID } in store.deviceMap.values()"
          :key="UniqueDeviceID" :value="`${DeviceID}:${UniqueDeviceID}`"
          :label="store.productMap.get(`${DeviceID}:${UniqueDeviceID}`)?.Name"
        />
      </XSelect>

      <XTag
        color="primary" label="16GB"
        class="rounded-full ring-1 ring-primary"
      />
    </div>

    <div class="flex items-center space-x-2">
      <XButton
        size="sm" color="warning"
        @click="handleRecoveryMode"
      >
        {{ isRecoveryMode ? '退出恢复模式' : '进入恢复模式' }}
      </XButton>

      <XButton
        icon="lucide:copy" size="sm"
        label="一键复制" @click="handleCopy"
      />
      <XButton
        icon="lucide:printer"
        size="sm" label="打印标签"
        :loading="isPrinting"
        @click="handlePrint"
      />
    </div>
  </div>
</template>

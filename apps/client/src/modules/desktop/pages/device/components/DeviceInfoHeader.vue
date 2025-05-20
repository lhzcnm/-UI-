<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

import { DEVICE_STORE, deviceConfig } from '../utils'

const store = inject(DEVICE_STORE)!
const isRecoveryMode = ref(false)

const { copy } = useClipboard({ legacy: true })

function handleRecoveryMode() {
  if (isRecoveryMode.value) handleExitRecoveryMode()
  else handleEnterRecoveryMode()
}

async function handleEnterRecoveryMode() {
  const [_, uniqueId] = store.selectedDevice.split(':')
  await fetch(`${deviceConfig.api}/enterRecoveryMode/${uniqueId}`)
  isRecoveryMode.value = true
}

async function handleExitRecoveryMode() {
  const device = store.deviceMap.get(store.selectedDevice)!
  await fetch(`${deviceConfig.api}/irecovery/${device.UniqueChipID}`)
  isRecoveryMode.value = false
}

function handleCopy() {
  const info = store.infoMap.get(store.selectedDevice)!
  const meta = [
    ['序列号', info.SerialNumber],
    ['串号', info.InternationalMobileEquipmentIdentity],
    ['型号号码', `${info.ModelNumber} ${info.RegionInfo}`],
    ['主板序号', info.WirelessBoardSerialNumber],
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
</script>

<template>
  <div
    :class="twJoin(
      'flex justify-between items-center',
      'py-2 px-3 border-b border-dashed',
    )"
  >
    <XSelect v-model="store.selectedDevice" ui-trigger="w-48">
      <XSelectItem
        v-for="{ DeviceID, UniqueDeviceID } in store.deviceMap.values()"
        :key="UniqueDeviceID" :value="`${DeviceID}:${UniqueDeviceID}`"
        :label="store.deviceChipMap.get(`${DeviceID}:${UniqueDeviceID}`)?.Name"
      />
    </XSelect>

    <div class="flex items-center space-x-2">
      <XButton
        icon="lucide:leaf" size="sm" color="success"
        @click="handleRecoveryMode"
      >
        {{ isRecoveryMode ? '退出恢复模式' : '进入恢复模式' }}
      </XButton>

      <XButton icon="lucide:copy" size="sm" @click="handleCopy">
        一键复制
      </XButton>
    </div>
  </div>
</template>

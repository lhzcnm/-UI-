import { defineStore } from 'pinia'

import type { DeviceMapItem, DeviceRecoveryData, DeviceRecoveryMapItem, DeviceResponse } from '@/types/device'
import { checkVersion, handleDevice, handleDisconnect, handleInfo, processRecoveryDevice } from '@/utils/device'
import { ws, wsFetch } from '@/utils/device/websocket'

export const useDeviceStore = defineStore('device', () => {
  const deviceMap = ref<Map<string, DeviceMapItem>>(new Map())
  const recoveryDeviceMap = ref<Map<string, DeviceRecoveryMapItem>>(new Map())
  const version = ref<string>('')
  const hasNewVersion = ref<boolean>(false)
  const pluginMustUpdate = ref<boolean>(false)

  watch(
    ws.data,
    async (val: string) => {
      if (val.startsWith('disconnected')) {
        if (checkVersion(version.value)) {
          pluginMustUpdate.value = true
        }
  
        if (val.includes('Recovery ')) {
          const match = val.match(/0x[0-9a-fA-F]+/)
          if (match) {
            recoveryDeviceMap.value.delete(match[0])
          }
          return
        }
  
        deviceMap.value = handleDisconnect(val, deviceMap.value)

        console.log(deviceMap.value)
        return
      }

      const data = JSON.parse(val) as any
      if (data.type === 'recovery_attached') {
        const rawData = data.data as DeviceRecoveryData
        recoveryDeviceMap.value.set(rawData.ECID, processRecoveryDevice(rawData))
        return
      }

      if (val.startsWith('{"id"}')) return
      if (val.includes('DeviceID')) {
        const rawData = data as DeviceResponse
        version.value = rawData.Version
        if (checkVersion(rawData.Version)) {
          pluginMustUpdate.value = true
        }

        deviceMap.value = await handleDevice(data, deviceMap.value)
        console.log(deviceMap.value)
      }
    }
  )

  async function getPluginInfo() {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 3000)

    try {
      const response = await fetch(
        'http://localhost:9999/plugin',
        {
          signal: controller.signal,
          headers: {'x-token': Date.now().toString(16)},
        },

      )
      const { data } = await response.json()
      version.value = data.version
    } catch {
      try {
        const data = await wsFetch({ type: 'pluginInfo' }) as any
        version.value = data.version
      } catch {
        throw new Error('未检测到插件运行')
      }
    }
  }

  async function getNormalDevices() {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 3000)

    try {
      const response = await fetch(
        'http://localhost:9999/info',
        {
          signal: controller.signal,
          headers: {'x-token': Date.now().toString(16)},
        },
      )
    
      const { data } = await response.json() as { data: DeviceResponse[] }
      version.value = data[0].Version
      deviceMap.value = await handleInfo(data)
    } catch {
      try {
        const data = await wsFetch({ type: 'info' })
        deviceMap.value = await handleInfo(data as DeviceResponse[])
      } catch {
        return false
      }
    }
  }

  async function getRecoveryDevices() {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch(
        'http://localhost:9999/info/recovery',
        {
          signal: controller.signal,
          headers: {'x-token': Date.now().toString(16)},
        },
      )
      const { data } = await response.json() as { data: DeviceRecoveryData[] }

      for (let item of data) {
        recoveryDeviceMap.value.set(item.ECID, processRecoveryDevice(item))
      }
    } catch {
      try {
        const data = await wsFetch({ type: 'recoveryInfo' }) as DeviceRecoveryData[]
        for (let item of data) {
          recoveryDeviceMap.value.set(item.ECID, processRecoveryDevice(item))
        }
      } catch {
        return false
      }
    }
  }

  return {
    deviceMap,
    recoveryDeviceMap,
    version,
    hasNewVersion,
    pluginMustUpdate,

    getPluginInfo,
    getNormalDevices,
    getRecoveryDevices,
  }
})
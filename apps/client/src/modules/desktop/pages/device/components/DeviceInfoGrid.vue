<script setup lang="ts">
import { DEVICE_STORE, deviceConfig } from '../utils'
import http from '@/utils/http'

import { tv } from 'tailwind-variants'
import { useClipboard } from '@vueuse/core'
import { xconfirm } from '@3un/shared/confirm'
import { toast } from 'vue-sonner'
import { Icon } from '@iconify/vue'

const store = inject(DEVICE_STORE)!
const uStore = useUserStore()

const { copy } = useClipboard({ legacy: true })
const style = tv({
  slots: {
    label: 'inline-block w-20 text-muted-foreground',
    value: 'cursor-pointer hover:text-primary active:text-primary/80',
  },
})

const device = computed(() => store.deviceMap.get(store.selectedDevice)!)
const info = computed(() => store.infoMap.get(store.selectedDevice)!)

const isActivated = ref(device.value.ActivationState === 'Activated')

const loadings = reactive({
  networkLock: false,
  activationLock: false,
  warranty: false,
})

async function handleActivation() {
  const suffix = isActivated.value ? 'deactivate' : 'activation'
  const [_, uniqueId] = store.selectedDevice.split(':')
  
  await fetch(`${deviceConfig.api}/${suffix}/${uniqueId}`)
  isActivated.value = !isActivated.value
  
  const info = store.infoMap.get(store.selectedDevice)!
  info.ActivationState = isActivated.value ? '已激活' : '未激活'
}

async function handleNetworkLock() {
  if (!await checkFreecount(1160)) return

  loadings.networkLock = true
  const response = http.post('/device/query', {
    imei: device.value.InternationalMobileEquipmentIdentity,
    imei2: device.value.InternationalMobileEquipmentIdentity2,
    sn: device.value.SerialNumber,
    serviceId: 1160,
    type: 'NetworkLock',
  })

  response.then(({ data }) => {
    const options = {
      Unlocked: '无锁',
      Locked: '有锁',
      Lost: '丢失',
      blocked: '不允许激活设备',
      TryMeid: '需要重试'
    }

    const status = options[data as keyof typeof options]
    const info = store.infoMap.get(store.selectedDevice)!
    info.NetworkLock = `${data}(${status})`

    uStore.updateCredit()
  })

  response.finally(() => {
    loadings.networkLock = false
  })
}

async function handleActivationLock() {
  if (! await checkFreecount(1161)) return

  loadings.activationLock = true
  const response = http.post('/device/query', {
    imei: device.value.InternationalMobileEquipmentIdentity,
    imei2: device.value.InternationalMobileEquipmentIdentity2,
    sn: device.value.SerialNumber,
    serviceId: 1161,
    type: 'ActivationLock',
  })

  response.then(({ data }) => {
    let status = '未知错误'
    if (data === '开启') status = 'ON'
    else if (data === '关闭') status = 'OFF'

    const info = store.infoMap.get(store.selectedDevice)!
    info.ActivationLock = `${status}(${data})`
    uStore.updateCredit()
  })

  response.finally(() => {
    loadings.activationLock = false
  })
}

async function handleWarranty() {
  if (!await checkFreecount(1162)) return

  loadings.warranty = true
  const response = http.post('/device/query', {
    sn: device.value.SerialNumber,
    serviceId: 1162,
    type: 'Warranty',
  })

  response.then(({ data }) => {
    const info = store.infoMap.get(store.selectedDevice)!
    info.Warranty = data
    uStore.updateCredit()
  })

  response.finally(() => {
    loadings.warranty = false
  })
}

async function checkFreecount(id: number) {
  const { data } = await http.get(`/device/query/${id}`)
  if (data.freeCount > 0) return true
  return await xconfirm`
    当前账户该服务已无免费查询次数<br>
    如果继续查询，将扣除 ${data.price} 积分
  `
}

async function cp(event: MouseEvent) {
  const target = event.target as HTMLElement
  const text = target.textContent

  if (text && text.trim()) {
    await copy(text.trim())
    toast.success('复制成功')
  }
}

const b = style()
</script>

<template>
  <div class="flex gap-12 p-4 bg-card whitespace-nowrap">
    <div class="flex-1 space-y-1">
      <div>
        <span :class="b.label()">序列号</span>
        <span :class="b.value()" @click="cp">
          {{ info.SerialNumber }}
        </span>
      </div>
      <div>
        <span :class="b.label()">串号</span>
        <span :class="b.value()" @click="cp">
          {{ info.InternationalMobileEquipmentIdentity }}
        </span>
      </div>
      <div>
        <span :class="b.label()">型号号码</span>
        <span :class="b.value()" @click="cp">
          {{ info.ModelNumber }} {{ info.RegionInfo }}
        </span>
      </div>
      <div>
        <span :class="b.label()">主板序号</span>
        <span :class="b.value()" @click="cp">
          {{ info.WirelessBoardSerialNumber }}
        </span>
      </div>
      <div>
        <span :class="b.label()">系统版本</span>
        <span :class="b.value()" @click="cp">
          {{ info.ProductVersion }} ({{ info.BuildVersion }})
        </span>
      </div>
      <div>
        <span :class="b.label()">ECID</span>
        <span :class="b.value()" @click="cp">
          {{ info.UniqueChipID }}
        </span>
      </div>
      <div>
        <span :class="b.label()">UDID</span>
        <span :class="b.value()" @click="cp">
          {{ info.UniqueDeviceID }}
        </span>
      </div>
    </div>

    <div class="flex-1 space-y-1">
      <div class="flex items-center">
        <span :class="b.label()">激活状态</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ info.ActivationState }}
          </span>
          <button class="ml-2 text-primary" @click="handleActivation">
            {{ isActivated ? '反激活' : '激活' }}
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">网络锁</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">{{ info.NetworkLock }}</span>
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
        <span :class="b.label()">激活锁</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">{{ info.ActivationLock }}</span>
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
        <span :class="b.label()">保修期限</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">{{ info.Warranty }}</span>
          <button
            class="flex items-center space-x-1.5 ml-2 text-primary"
            :disabled="loadings.warranty"
            @click="handleWarranty"
          >
            <Icon v-if="loadings.warranty" icon="lucide:loader-2" class="animate-spin" />
            <span>{{ loadings.warranty ? '查询中...' : '立即查询' }}</span>
          </button>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">iCloud</span>
        <div class="flex-1 flex items-center justify-between">
          <span :class="b.value()" @click="cp">
            {{ info.iCloud }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <span :class="b.label()">CPU</span>
        <span :class="b.value()" @click="cp">
          {{ info.CPU }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { STORE, formatSize } from '../utils'

const store = inject(STORE)!
const deviceStore = useDeviceStore()

const { t } = useI18n()

const diskInfo = computed(() => {
  const { memory } = deviceStore.deviceMap.get(store.selected)!
  const total = memory.TotalDiskCapacity
  const systemCapacity = memory.TotalSystemCapacity
  const dataCapacity = memory.TotalDataCapacity
  const avaialCapacity = memory.AmountDataAvailable

  return {
    totalDiskCapacity: formatSize(total),
    totalSystemCapacity: formatSize(systemCapacity),
    totalDataCapacity: formatSize(dataCapacity),
    amountDataAvailable: formatSize(avaialCapacity),
    
    totalDiskCapacityPer: getPercentage(total, total),
    totalSystemCapacityPer: getPercentage(systemCapacity, total),
    totalDataCapacityPer: getPercentage(dataCapacity, total),
    amountDataAvailablePer: getPercentage(avaialCapacity, total),
  }
})

function getPercentage(part: number, total: number) {
  return Math.round((part / total) * 100)
}
</script>

<template>
  <div class="p-4 overflow-hidden bg-card border rounded-lg">
    <div class="text-lg font-medium mb-4">{{ t('device.info.disk.space') }}</div>
    <div class="mb-3">
      <div class="flex justify-between mb-1">
        <span class="text-sm">{{ t('device.info.disk.total') }}</span>
        <span class="text-sm">{{ diskInfo.totalDiskCapacity }}</span>
      </div>
      <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div class="bg-primary h-full rounded-full" style="width: 100%"></div>
      </div>
    </div>

    <div class="mb-3">
      <div class="flex justify-between mb-1">
        <span class="text-sm">{{ t('device.info.disk.system') }}</span>
        <span class="text-sm">
          {{ diskInfo.totalSystemCapacity }}
          ({{ diskInfo.totalSystemCapacityPer }}%)
        </span>
      </div>
      <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          class="bg-orange-500 h-full rounded-full"
          :style="{ width: `${diskInfo.totalSystemCapacityPer}%` }"
        />
      </div>
    </div>

    <div class="mb-3">
      <div class="flex justify-between mb-1">
        <span class="text-sm">{{ t('device.info.disk.data') }}</span>
        <span class="text-sm">
          {{ diskInfo.totalDataCapacity }}
          ({{ diskInfo.totalDataCapacityPer }}%)
        </span>
      </div>
      <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          class="bg-primary h-full rounded-full"
          :style="{ width: `${diskInfo.totalDataCapacityPer}%` }"
        />
      </div>
    </div>

    <div>
      <div class="flex justify-between mb-1">
        <span class="text-sm">{{ t('device.info.disk.useful') }}</span>
        <span class="text-sm">
          {{ diskInfo.amountDataAvailable }}
          ({{ diskInfo.amountDataAvailablePer }}%)
        </span>
      </div>
      <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          class="bg-success h-full rounded-full"
          :style="{ width: `${diskInfo.amountDataAvailablePer}%` }"
        />
      </div>
    </div>
  </div>
</template>

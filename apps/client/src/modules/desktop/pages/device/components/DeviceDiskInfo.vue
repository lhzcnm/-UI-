<script setup lang="ts">
import { DEVICE_STORE, formatSize } from '../utils'

const store = inject(DEVICE_STORE)!

const diskInfo = computed(() => {
  const { info } = store.deviceMap.get(store.selected)!
  const total = info.TotalDiskCapacity

  return {
    totalDiskCapacity: formatSize(total),
    totalSystemCapacity: formatSize(info.TotalSystemCapacity),
    totalDataCapacity: formatSize(info.TotalDataCapacity),
    amountDataAvailable: formatSize(info.AmountDataAvailable),
    totalDiskCapacityPer: getPercentage(info.TotalDiskCapacity, total),
    totalSystemCapacityPer: getPercentage(info.TotalSystemCapacity, total),
    totalDataCapacityPer: getPercentage(info.TotalDataCapacity, total),
    amountDataAvailablePer: getPercentage(info.AmountDataAvailable, total),
  }
})

function getPercentage(part: number, total: number) {
  return Math.round((part / total) * 100)
}
</script>

<template>
  <div class="p-4 overflow-hidden bg-card border rounded-lg">
    <div class="text-lg font-medium mb-4">存储空间</div>
    <div class="mb-3">
      <div class="flex justify-between mb-1">
        <span class="text-sm">总容量</span>
        <span class="text-sm">{{ diskInfo.totalDiskCapacity }}</span>
      </div>
      <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div class="bg-primary h-full rounded-full" style="width: 100%"></div>
      </div>
    </div>

    <div class="mb-3">
      <div class="flex justify-between mb-1">
        <span class="text-sm">系统占用</span>
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
        <span class="text-sm">用户数据</span>
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
        <span class="text-sm">可用空间</span>
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

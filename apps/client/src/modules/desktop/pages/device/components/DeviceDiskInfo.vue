<script setup lang="ts">
import { DEVICE_STORE } from '../utils'

const store = inject(DEVICE_STORE)!
const diskInfo = computed(() => {
  const { TotalDiskCapacity, TotalSystemCapacity, TotalDataCapacity, AmountDataAvailable } = store.info
  return {
    totalDiskCapacity: formatFileSize(TotalDiskCapacity),
    totalSystemCapacity: formatFileSize(TotalSystemCapacity),
    totalDataCapacity: formatFileSize(TotalDataCapacity),
    amountDataAvailable: formatFileSize(AmountDataAvailable),
    totalDiskCapacityPercentage: getPercentage(TotalDiskCapacity, TotalDiskCapacity),
    totalSystemCapacityPercentage: getPercentage(TotalSystemCapacity, TotalDiskCapacity),
    totalDataCapacityPercentage: getPercentage(TotalDataCapacity, TotalDiskCapacity),
    amountDataAvailablePercentage: getPercentage(AmountDataAvailable, TotalDiskCapacity),
  }
})

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i]
}

function getPercentage(part: number, total: number) {
  return Math.round((part / total) * 100)
}
</script>

<template>
  <div class="flex-1 bg-card border rounded-lg p-4 overflow-hidden">
    <div class="text-lg font-medium mb-2">存储空间</div>
    <div class="space-y-3">
      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm">总容量</span>
          <span class="text-sm">{{ diskInfo.totalDiskCapacity }}</span>
        </div>
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div class="bg-primary h-full rounded-full" style="width: 100%"></div>
        </div>
      </div>

      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm">系统占用</span>
          <span class="text-sm">
            {{ diskInfo.totalSystemCapacity }}
            ({{ diskInfo.totalSystemCapacityPercentage }}%)
          </span>
        </div>
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="bg-orange-500 h-full rounded-full"
            :style="{ width: `${diskInfo.totalSystemCapacityPercentage}%` }"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm">用户数据</span>
          <span class="text-sm">
            {{ diskInfo.totalDataCapacity }}
            ({{ diskInfo.totalDataCapacityPercentage }}%)
          </span>
        </div>
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="bg-primary h-full rounded-full"
            :style="{ width: `${diskInfo.totalDataCapacityPercentage}%` }"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm">可用空间</span>
          <span class="text-sm">
            {{ diskInfo.amountDataAvailable }}
            ({{ diskInfo.amountDataAvailablePercentage }}%)
          </span>
        </div>
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="bg-success h-full rounded-full"
            :style="{ width: `${diskInfo.amountDataAvailablePercentage}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

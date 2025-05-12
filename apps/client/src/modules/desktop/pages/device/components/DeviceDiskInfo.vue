<script setup lang="ts">
import { DEVICE_STORE } from '../utils'

const store = inject(DEVICE_STORE)!

const totalDiskCapacity = formatFileSize(store.info.TotalDiskCapacity)
const totalSystemCapacity = formatFileSize(store.info.TotalSystemCapacity)
const totalDataCapacity = formatFileSize(store.info.TotalDataCapacity)
const amountDataAvailable = formatFileSize(store.info.AmountDataAvailable)

// const totalDiskCapacityPercentage = getPercentage(store.info.TotalDiskCapacity, store.info.TotalDiskCapacity)
const totalSystemCapacityPercentage = getPercentage(store.info.TotalSystemCapacity, store.info.TotalDiskCapacity)
const totalDataCapacityPercentage = getPercentage(store.info.TotalDataCapacity, store.info.TotalDiskCapacity)
const amountDataAvailablePercentage = getPercentage(store.info.AmountDataAvailable, store.info.TotalDiskCapacity)

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
  <div class="flex-1 bg-card border rounded-lg px-4 py-2 overflow-hidden">
    <div class="text-lg font-medium mb-2">存储空间</div>
    <div class="space-y-3">
      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm">总容量</span>
          <span class="text-sm">{{ totalDiskCapacity }}</span>
        </div>
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div class="bg-primary h-full rounded-full" style="width: 100%"></div>
        </div>
      </div>

      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm">系统占用</span>
          <span class="text-sm">
            {{ totalSystemCapacity }}
            ({{ totalSystemCapacityPercentage }}%)
          </span>
        </div>
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="bg-orange-500 h-full rounded-full"
            :style="{ width: `${totalSystemCapacityPercentage}%` }"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm">用户数据</span>
          <span class="text-sm">
            {{ totalDataCapacity }}
            ({{ totalDataCapacityPercentage }}%)
          </span>
        </div>
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="bg-primary h-full rounded-full"
            :style="{ width: `${totalDataCapacityPercentage}%` }"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between mb-1">
          <span class="text-sm">可用空间</span>
          <span class="text-sm">
            {{ amountDataAvailable }}
            ({{ amountDataAvailablePercentage }}%)
          </span>
        </div>
        <div class="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="bg-success h-full rounded-full"
            :style="{ width: `${amountDataAvailablePercentage}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

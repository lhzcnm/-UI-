<script setup lang="ts">
import type { DeviceInfo } from '../types'

interface DeviceInfoGridProps {
  deviceInfo: DeviceInfo
}

defineProps<DeviceInfoGridProps>()
</script>

<template>
  <div class="grid grid-cols-2 gap-12 p-4 bg-card">
    <div class="space-y-1">
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">序列号</span>
        <span>{{ deviceInfo.serialNumber }}</span>
      </div>
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">越狱状态</span>
        <span>{{ deviceInfo.jailbreakStatus }}</span>
      </div>
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">主板序号</span>
        <span>{{ deviceInfo.boardNumber }}</span>
      </div>
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">串号</span>
        <span>{{ deviceInfo.imei }}</span>
      </div>
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">ECID</span>
        <span>{{ deviceInfo.ecid }}</span>
      </div>
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">系统版本</span>
        <span>{{ deviceInfo.osVersion }}</span>
      </div>
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">屏幕厂商</span>
        <span>{{ deviceInfo.screenManufacturer }}</span>
      </div>
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">UDID</span>
        <span>{{ deviceInfo.udid }}</span>
      </div>
    </div>

    <div class="space-y-1">
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">型号号码</span>
        <span>{{ deviceInfo.modelNumber }}</span>
      </div>
      <div class="info-row flex justify-between">
        <span class="text-muted-foreground">激活状态</span>
        <span>{{ deviceInfo.activationStatus }}</span>
      </div>
      <div class="info-row flex justify-between items-center">
        <span class="text-muted-foreground">iCloud</span>
        <div class="flex items-center">
          <span>{{ deviceInfo.icloud }}</span>
          <a href="#" class="ml-4 text-primary">iCloud 详情</a>
        </div>
      </div>
      <div class="info-row flex justify-between items-center">
        <span class="text-muted-foreground">保修期限</span>
        <div class="flex items-center">
          <span>{{ deviceInfo.warranty }}</span>
          <a href="#" class="ml-4 text-blue-500">立即查询</a>
        </div>
      </div>
      <div class="info-row flex justify-between items-center">
        <span class="text-muted-foreground">WIFI</span>
        <div class="flex items-center">
          <span>{{ deviceInfo.wifi }}</span>
          <a href="#" class="ml-4 text-primary">查看详情</a>
        </div>
      </div>
      <div class="info-row flex justify-between items-center">
        <span class="text-muted-foreground">CPU</span>
        <div class="flex items-center">
          <span>{{ deviceInfo.cpu }}</span>
          <a href="#" class="ml-4 text-primary">查看详情</a>
        </div>
      </div>
      <div class="info-row flex justify-between items-center">
        <span class="text-muted-foreground">崩溃分析</span>
        <div class="flex items-center">
          <span>{{ deviceInfo.crashAnalysis }}</span>
          <a href="#" class="ml-4 text-primary">崩溃详情</a>
        </div>
      </div>
      <div class="info-row flex justify-between items-center">
        <span class="text-muted-foreground"></span>
        <a href="#" class="text-primary">设备详情</a>
      </div>
    </div>
  </div>
</template>

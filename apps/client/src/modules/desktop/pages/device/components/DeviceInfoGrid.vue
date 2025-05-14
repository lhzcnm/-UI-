<script setup lang="ts">
import { DEVICE_STORE } from '../utils'

const store = inject(DEVICE_STORE)!
</script>

<template>
  <div class="grid grid-cols-2 gap-12 p-4 bg-card">
    <div class="space-y-1 whitespace-nowrap">
      <div>
        <span class="inline-block w-24 text-muted-foreground">序列号</span>
        <span>{{ store.info.SerialNumber }}</span>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">越狱状态</span>
        <span>{{ store.info.SIMStatus }}</span>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">主板序号</span>
        <span>{{ store.info.WirelessBoardSerialNumber }}</span>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">串号</span>
        <span>{{ store.info.InternationalMobileEquipmentIdentity }}</span>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">ECID</span>
        <span>???</span>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">系统版本</span>
        <span>{{ store.info.ProductVersion }} ({{ store.info.BuildVersion }})</span>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">UDID</span>
        <span>{{ store.info.UniqueDeviceID }}</span>
      </div>
    </div>

    <div class="space-y-1 whitespace-nowrap">
      <div>
        <span class="inline-block w-24 text-muted-foreground">型号号码</span>
        <span>{{ store.info.ModelNumber }} {{ store.info.RegionInfo }}</span>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">激活状态</span>
        <span>{{ store.info.ActivationState }}</span>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">iCloud</span>
        <div class="inline-flex items-center">
          <span>查询中...</span>
          <a href="#" class="ml-2 text-primary">iCloud 详情</a>
        </div>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">保修期限</span>
        <div class="inline-flex items-center">
          <span>查询中...</span>
          <a href="#" class="ml-2 text-primary">立即查询</a>
        </div>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">WIFI</span>
        <div class="inline-flex items-center">
          <span>{{ store.info.WiFiAddress }}</span>
          <a href="#" class="ml-2 text-primary">查看详情</a>
        </div>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">CPU</span>
        <div class="inline-flex items-center">
          <span>{{ store.info.CPUArchitecture }}</span>
          <a href="#" class="ml-2 text-primary">查看详情</a>
        </div>
      </div>
      <div>
        <span class="inline-block w-24 text-muted-foreground">崩溃分析</span>
        <div class="inline-flex items-center">
          <span>分析中...</span>
          <a href="#" class="ml-2 text-primary">崩溃详情</a>
        </div>
      </div>
    </div>
  </div>
</template>

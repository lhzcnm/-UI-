<script setup lang="ts">
import DevicePhoneDisplay from '../components/DevicePhoneDisplay.vue'
import DeviceInfoHeader from '../components/DeviceInfoHeader.vue'
import DeviceInfoGrid from '../components/DeviceInfoGrid.vue'
import DeviceBatteryInfo from '../components/DeviceBatteryInfo.vue'
import DeviceDiskInfo from '../components/DeviceDiskInfo.vue'
</script>

<template>
  <div class="flex">
    <DevicePhoneDisplay class="w-80 flex-shrink-0" />

    <div class="flex-1 min-w-[800px] max-w-screen-lg py-4">
      <div class="overflow-hidden border rounded-lg mb-4">
        <DeviceInfoHeader />
        <DeviceInfoGrid />
      </div>

      <div class="flex space-x-4">
        <DeviceBatteryInfo class="flex-1" />
        <DeviceDiskInfo class="flex-1" />
      </div>
    </div>
  </div>
</template>

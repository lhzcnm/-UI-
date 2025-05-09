<script setup lang="ts">
interface DeviceBatteryInfo {
  batteryHealth: string;
  cycleCount: string;
}

interface DeviceBatteryInfoEmits {
  (e: 'switch-tab', tab: string): void;
}

defineProps<DeviceBatteryInfo>()
defineEmits<DeviceBatteryInfoEmits>()
</script>

<template>
  <div class="flex-1 bg-card border rounded-lg overflow-hidden h-72"></div>
</template>

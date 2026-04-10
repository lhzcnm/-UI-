<script setup lang="ts">
import { type OrderAutoCleanSettings } from '@/inters/orders'

const form = defineModel<OrderAutoCleanSettings>({ required: true })
</script>

<template>
  <form class="space-y-4 rounded-xl shadow-sm">
    <div class="flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-sm font-medium text-label">
          开启自动清理
        </span>
        <span class="text-xs text-gray-500">
          自动清理过期订单数据
        </span>
      </div>

      <XSwitch v-model="form.autoCleanEnable" />
    </div>

    <div
      class="px-2 border-l-2 border-l-border space-y-2"
    >
      <label class="text-sm text-label">
        订单保留天数(单位: 天)
      </label>

      <div class="flex items-center gap-2">
        <XInput
          class="w-32"
          placeholder="例如 30"
          v-model="form.orderRetainDays"
        />
        <!-- <span class="text-sm text-gray-500">天</span> -->
      </div>
    </div>
  </form>
</template>

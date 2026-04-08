<script setup lang="ts">
import { type OrderAutoCleanSettings } from '@/inters/orders'
import { XFormField } from '@3un/ui'

const form = defineModel<OrderAutoCleanSettings>({ required: true })
</script>

<template>
  <form class="divide-y">
    <XFormField label="允许自动清理" desc="是否开启订单自动清理">
      <XSwitch class="ml-auto" v-model="form.autoCleanEnable" />
    </XFormField>
    <XFormField label="订单保留天数" desc="设置保留订单最大天数">
      <div class="ml-auto flex items-center gap-2">
        <XInput ui-root="w-20" v-model="form.orderRetainDays" />
        <span>天</span>
      </div>
    </XFormField>
  </form>
</template>

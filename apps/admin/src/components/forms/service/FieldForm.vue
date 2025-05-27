<script setup lang="ts">
import type { ServiceFieldCreateParams } from '@/inters/services'

const form = defineModel<ServiceFieldCreateParams>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">服务名称</label>
      <SelectService v-model="form.serviceId" />
    </div>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">字段名称</label>
      <XInput v-model="form.name" placeholder="字段名称" />
    </div>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">字段宽度</label>
      <XInputNumber v-model="form.width" :step="10" placeholder="字段宽度" />
    </div>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">排序</label>
      <XInputNumber v-model="form.sortNum" :step="1" placeholder="排序" />
    </div>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">是否显示</label>
      <XSwitch v-model="form.status" :active-value="1" :inactive-value="0" />
    </div>
  </form>
</template>

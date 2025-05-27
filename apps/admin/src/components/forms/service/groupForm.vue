<script setup lang="ts">
import type { ServiceGroupCreateParams } from '@/inters/services'

const form = defineModel<ServiceGroupCreateParams>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">服务组名称</label>
      <XInput v-model="form.category" placeholder="服务组名称" />
    </div>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">服务名称EN</label>
      <XInput v-model="form.categoryLocal" placeholder="服务组英文名称" />
    </div>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">排序</label>
      <XInputNumber v-model="form.orderBy" :step="1" placeholder="排序数值" />
    </div>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">禁用服务组</label>
      <XSwitch
        v-model="form.disableCategory"
        :active-value="1"
        :inactive-value="0"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { ServiceGroup } from '@/inters/services'

const form = defineModel<ServiceGroup>({ required: true })
</script>

<template>
  <form class="space-y-3" @submit.prevent>
    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">服务组名称</label>
      <XInput v-model="form.category" placeholder="服务组名称" />
    </div>
    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">服务名称EN</label>
      <XInput v-model="form.categoryLocal" placeholder="服务组英文名称" />
    </div>
  </form>
</template>

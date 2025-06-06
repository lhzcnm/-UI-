<script setup lang="ts">
import type { LevelCreateParams } from '@/inters/level'

const form = defineModel<LevelCreateParams>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-label text-sm mb-1">等级名称</label>
      <XInput v-model="form.pricePlan" placeholder="等级名称" />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">等级名称EN</label>
      <XInput v-model="form.pricePlanLocal" placeholder="等级名称EN" />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">禁用</label>
      <XSwitch v-model="form.disablePricePlan" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { LogSearch } from '@/inters/logs'

const form = defineModel<LogSearch>({ required: true })
</script>

<template>
  <form class="space-y-3" @submit.prevent>
    <div>
      <label class="block text-sm mb-1">IP地址</label>
      <XInput v-model="form.ip" placeholder="IP地址" />
    </div>
    <div>
      <label class="block text-sm mb-1">用户ID</label>
      <XInput v-model="form.userId" placeholder="用户ID" />
    </div>
    <div>
      <label class="block text-sm mb-1">开始时间</label>
      <XInput v-model="form.startTime" placeholder="开始时间" />
    </div>
    <div>
      <label class="block text-sm mb-1">结束时间</label>
      <XInput v-model="form.endTime" placeholder="结束时间" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { LogSearchForm } from '@/inters/logs'
const form = defineModel<LogSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-label text-sm mb-1">登录时间</label>
      <XDateRangePicker
        v-model:start="form.startTime"
        v-model:end="form.endTime"
        label-format="YYYY-MM-DD"
        placeholder="选择登录时间范围"
      />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">登录IP</label>
      <XInput v-model="form.ip" placeholder="IP地址" />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">用户ID</label>
      <XInput v-model="form.userId" placeholder="用户ID" />
    </div>
  </form>
</template>

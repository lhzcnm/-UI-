<script setup lang="ts">
import type { LogSearchForm } from '@/inters/logs'
import { handleInputChange } from '@/utils'

const form = defineModel<LogSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="flex space-x-3">
      <div class="flex-1">
        <label class="block text-sm text-label mb-1">开始时间</label>
        <XNativeDate
          v-model="form.startTime"
          label-format="YYYY-MM-DD"
          placeholder="开始时间"
        />
      </div>
      <div class="flex-1">
        <label class="block text-sm text-label mb-1">结束时间</label>
        <XNativeDate
          v-model="form.endTime"
          label-format="YYYY-MM-DD"
          placeholder="结束时间"
        />
      </div>
    </div>
    <div>
      <label class="block text-label text-sm mb-1">登录IP</label>
      <XInput v-model="form.ip" placeholder="IP地址" />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">用户ID</label>
      <XInput
        v-model="form.userId"
        placeholder="用户ID"
        @input="(e: Event) => form.userId = handleInputChange(e)"
        @change="(e: Event) => form.userId = handleInputChange(e)"
      />
    </div>
  </form>
</template>

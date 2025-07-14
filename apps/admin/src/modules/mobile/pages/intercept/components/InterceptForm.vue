<script setup lang="ts">
import type { InterceptForm } from '@/inters/intercept'

const form = defineModel<InterceptForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-1">拦截IP</label>
      <XInput v-model="form.ip" placeholder="拦截IP" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">过期时间(不选，默认永久)</label>
      <XNativeDate v-model="form.expireTime" placeholder="过期时间" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">备注</label>
      <XTextarea v-model="form.comments" placeholder="备注" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { InterceptForm } from '@/inters/intercept'

const form = defineModel<InterceptForm>({ required: true })
</script>

<template>
  <form class="space-y-3" @submit.prevent>
    <div>
      <label class="block text-sm mb-1">拦截IP</label>
      <XInput v-model="form.ip" placeholder="拦截IP" />
    </div>
    <div>
      <label class="block text-sm mb-1">过期时间</label>
      <XInput v-model="form.expireTime" placeholder="过期时间" />
    </div>
    <div>
      <label class="block text-sm mb-1">备注</label>
      <XTextarea v-model="form.comments" placeholder="备注" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { type MonitorUserCreate } from '@/inters/monitor/user'

const form = defineModel<MonitorUserCreate>({ required: true })
</script>

<template>
  <form class="divide-y divide-border">
    <FormField label="用户名" desc="登录中控平台用户名" required>
      <XInput placeholder="请输入用户名" v-model="form.username" />
    </FormField>
    <FormField label="密码" desc="登录中控平台用户密码" required>
      <XInput placeholder="请输入密码" v-model="form.password" />
    </FormField>
  </form>
</template>

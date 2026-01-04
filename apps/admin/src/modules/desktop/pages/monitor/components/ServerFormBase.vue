<script setup lang="ts">
import { type MonitorServerForm } from '@/inters/monitor/server'

const form = defineModel<MonitorServerForm>({ required: true })
</script>

<template>
  <form class="divide-y divide-dashed divide-border">
    <FormField label="服务器ip" desc="监控服务器ip" required>
      <XInput placeholder="请输入服务器ip" v-model="form.serverIp" />
    </FormField>

    <FormField label="服务器名称" desc="监控服务器名称" required>
      <XInput placeholder="请输入服务器名称" v-model="form.serverName" />
    </FormField>

    <FormField label="服务器域名" desc="监控订单后端" required>
      <XInput placeholder="请输入服务器域名" v-model="form.domain" />
    </FormField>

    <FormField label="公众号名称" desc="公众号名称" required>
      <XInput placeholder="请输入公众号名称" v-model="form.domainName" />
    </FormField>
  </form>
</template>

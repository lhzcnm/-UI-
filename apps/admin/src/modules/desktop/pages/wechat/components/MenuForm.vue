<script setup lang="ts">
import type { WechatMenuCreateParams } from '@/inters/wechat'
const form = defineModel<WechatMenuCreateParams>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-1">菜单名称</label>
      <XInput v-model="form.name" placeholder="请输入菜单名称" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">排序</label>
      <XInputNumber v-model="form.orderBy" :step="1" :min="0" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">禁用</label>
      <XSwitch v-model="form.menuDisable" />
    </div>
  </form>
</template>

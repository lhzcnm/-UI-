<script setup lang="ts">
import type { CustomMsgCreateParams } from '@/inters/wechat'
const form = defineModel<CustomMsgCreateParams>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label for="keywords" class="block mb-1 text-sm text-muted-foreground">关键字。多个关键字，请使用(|)分隔</label>
      <XInput id="keywords" v-model="form.keywords" placeholder="例如：你好|您好|在吗" />
    </div>
    <div>
      <label for="content" class="block mb-1 text-sm text-muted-foreground">消息内容</label>
      <XTextarea id="content" v-model="form.content" rows="12" placeholder="触发关键字后，发送的消息内容" />
    </div>
  </form>
</template>

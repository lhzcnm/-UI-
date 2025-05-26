<script setup lang="ts">
import type { AdminCreateParams } from '@/inters/users'

const form = defineModel<AdminCreateParams>({ required: true })
</script>

<template>
  <form class="space-y-3" @submit.prevent>
    <div>
      <label class="block text-sm mb-1">账号</label>
      <XInput v-model="form.userName" placeholder="账号" />
    </div>
    <div>
      <label class="block text-sm mb-1">昵称</label>
      <XInput v-model="form.nickName" placeholder="昵称" />
    </div>
    <div>
      <label class="block text-sm mb-1">密码</label>
      <XInput v-model="form.userPassword" placeholder="密码" />
    </div>
    <div>
      <label class="block text-sm mb-1">微信ID</label>
      <XInput v-model="form.weiXinOpenid" placeholder="微信ID" />
    </div>
    <div>
      <label class="block text-sm mb-1">备注</label>
      <XTextarea v-model="form.comments" placeholder="备注" />
    </div>
    <div>
      <label class="block text-sm mb-1">禁用</label>
      <XSwitch v-model="form.disableUser" />
    </div>
  </form>
</template>

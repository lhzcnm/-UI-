<script setup lang="ts">
import type { UserPaidSearchForm } from '@/inters/users'
import { handleInputNumberChange } from '@/utils'

const form = defineModel<UserPaidSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="flex space-x-3">
      <div>
        <label class="block text-label text-sm mb-1">用户账号</label>
        <XInput v-model="form.username" placeholder="用户账号" />
      </div>
      <div>
        <label class="block text-label text-sm mb-1">用户昵称</label>
        <XInput v-model="form.nickname" placeholder="用户昵称" />
      </div>
    </div>

    <div>
      <label class="block text-label text-sm mb-1">用户ID</label>
      <XInput v-model="form.userId" placeholder="用户ID" @input="(e: Event) => form.userId = handleInputNumberChange(e)" />
    </div>

    <div>
      <label class="block text-label text-sm mb-1">微信ID</label>
      <XInput v-model="form.openId" placeholder="微信ID" />
    </div>
  </form>
</template>

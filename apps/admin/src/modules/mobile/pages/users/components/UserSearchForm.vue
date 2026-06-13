<script setup lang="ts">
import type { UserSearchForm } from '@/inters/users'
import { handleInputChange } from '@/utils'

const form = defineModel<UserSearchForm>({ required: true })
const levelStore = useLevelStore()
</script>

<template>
<form class="space-y-4" @submit.prevent>
    <div class="flex space-x-3">
      <div class="w-1/2">
        <label class="block text-label text-sm mb-1">用户ID</label>
        <XInput v-model="form.userId" placeholder="用户ID" @input="(e: Event) => form.userId = handleInputChange(e)"
          @change="(e: Event) => form.userId = handleInputChange(e)" />
      </div>

      <div class="w-1/2">
        <label class="block text-label text-sm mb-1">会员等级</label>
        <XSelect v-model="form.planId" placeholder="请选择会员等级">
          <XSelectItem :value="-1" label="全部" />
          <XSelectItem v-for="level in levelStore.levels" :key="level.pricePlanId" :value="level.pricePlanId"
            :label="level.pricePlan" />
        </XSelect>
      </div>
    </div>

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
      <label class="block text-label text-sm mb-1">微信ID</label>
      <XInput v-model="form.openId" placeholder="微信ID" />
    </div>

    <div class="flex justify-between">
      <label class="block text-label text-sm mb-1">心跳检测</label>
      <div class="flex justify-between w-2/3">
        <XRadio v-model="form.heartbeatEnabled" :value="-1" label="全部" />
        <XRadio v-model="form.heartbeatEnabled" :value="1" label="开启心跳" />
        <XRadio v-model="form.heartbeatEnabled" :value="0" label="关闭心跳" />
      </div>
    </div>

    <div class="flex justify-between">
      <label class="block text-label text-sm mb-1">用户禁用</label>
      <div class="flex justify-between w-2/3">
        <XRadio v-model="form.disableUser" :value="-1" label="全部" />
        <XRadio v-model="form.disableUser" :value="0" label="启用用户" />
        <XRadio v-model="form.disableUser" :value="1" label="禁用用户" />
      </div>
    </div>

    <div class="flex justify-between">
      <label class="block text-label text-sm mb-1">仅看管理员</label>
      <XSwitch v-model="form.isAdmin" />
    </div>
  </form>
</template>

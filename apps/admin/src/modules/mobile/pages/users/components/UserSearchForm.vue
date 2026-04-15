<script setup lang="ts">
import type { UserSearchForm } from '@/inters/users'
import { handleInputChange } from '@/utils'

const form = defineModel<UserSearchForm>({ required: true })
const levelStore = useLevelStore()
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-label text-sm mb-1">会员等级</label>
      <XNativeSelect
        v-model="form.planId"
        :default="undefined"
        :options="levelStore.levels"
        placeholder="请选择会员等级"
        value-key="pricePlanId"
        label-key="pricePlan"
      />
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
      <label class="block text-label text-sm mb-1">用户ID</label>
      <XInput
        v-model="form.userId"
        placeholder="用户ID"
        @input="(e: Event) => form.userId = handleInputChange(e)"
        @change="(e: Event) => form.userId = handleInputChange(e)"
      />
    </div>

    <div>
      <label class="block text-label text-sm mb-1">微信ID</label>
      <XInput v-model="form.openId" placeholder="微信ID" />
    </div>

    <div>
      <label class="block text-label text-sm mb-1">仅看管理员</label>
      <XSwitch v-model="form.isAdmin" />
    </div>
  </form>
</template>

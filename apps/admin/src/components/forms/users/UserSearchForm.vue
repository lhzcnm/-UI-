<script setup lang="ts">
import type { UserSearchForm } from '@/inters/users'

const form = defineModel<UserSearchForm>({ required: true })
const levelStore = useLevelStore()
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-muted-foreground text-sm mb-1">会员等级</label>
      <XSelect
        v-model="form.planId"
        placeholder="请选择会员等级"
        :default-value="undefined"
        clearable
      >
        <XSelectItem
          v-for="level in levelStore.levels" :key="level.pricePlanId"
          :value="level.pricePlanId" :label="level.pricePlan"
        />
      </XSelect>
    </div>

    <div class="flex space-x-3">
      <div>
        <label class="block text-muted-foreground text-sm mb-1">用户账号</label>
        <XInput v-model="form.username" placeholder="用户账号" />
      </div>
      <div>
        <label class="block text-muted-foreground text-sm mb-1">用户昵称</label>
        <XInput v-model="form.nickname" placeholder="用户昵称" />
      </div>
    </div>

    <div>
      <label class="block text-muted-foreground text-sm mb-1">用户ID</label>
      <XInput v-model="form.userId" placeholder="用户ID" />
    </div>

    <div>
      <label class="block text-muted-foreground text-sm mb-1">微信ID</label>
      <XInput v-model="form.openId" placeholder="微信ID" />
    </div>
  </form>
</template>

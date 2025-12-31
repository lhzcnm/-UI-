<script setup lang="ts">
import { type ActivityRuleUpdate } from '@/inters/activity/rule'

const form = defineModel<ActivityRuleUpdate>({ required: true })
</script>

<template>
  <form class="" @submit.prevent>
    <FormField label="充值积分" desc="触发规则的最小金额">
      <XInput placeholder="请输入充值积分" v-model="form.minAmount" />
    </FormField>
    <FormField label="赠送积分" desc="到达最低金额时赠送积分(自动转换%)">
      <XInput class="after:content-['%'] pr-2" placeholder="请输入赠送积分" v-model="form.bonusAmount" />
    </FormField>
    <FormField label="规则排序" desc="值越小越靠前">
      <XInputNumber :precision="1" :step="1" v-model="form.sortOrder!" />
    </FormField>
  </form>
</template>

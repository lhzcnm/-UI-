<script setup lang="ts">
import { VOUCHER_TYPE_LIST, VOUCHER_TYPE } from "@3un/utils"

import { type ActivityRuleUpdate } from '@/inters/activity/rule'

const form = defineModel<ActivityRuleUpdate>({ required: true })

const displayVouchers = computed(() => VOUCHER_TYPE_LIST.filter(item => item.value !== VOUCHER_TYPE.COMMON))
</script>

<template>
  <form class="" @submit.prevent>
    <FormField label="充值积分" desc="触发规则的最小金额">
      <XInput placeholder="请输入充值积分" v-model="form.minAmount" />
    </FormField>
    <FormField label="赠送积分" desc="到达最低金额时赠送积分(自动转换%)">
      <XInput class="after:content-['%'] pr-2" placeholder="请输入赠送积分" v-model="form.bonusAmount" />
    </FormField>
    <FormField label="赠送积分类型" desc="赠送积分只能用于特定服务或者不限制">
      <XSelect
        v-model="form.creditsUsageType"
      >
        <XSelectItem
          v-for="item in displayVouchers" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
    </FormField>
    <FormField label="规则排序" desc="值越小越靠前">
      <XInputNumber :precision="1" :step="1" v-model="form.sortOrder!" />
    </FormField>
  </form>
</template>

<script setup lang="ts">
import { VOUCHER_TYPE_LIST } from "@3un/utils"

import type { VoucherCreateForm } from '@/inters/voucher'
import { handleInputChange } from '@/utils'

const form = defineModel<VoucherCreateForm>({ required: true })
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <FormField class="py-2" label="金额" desc="" required variant="vertical">
      <XInput v-model="form.amount" placeholder="请输入金额" @input="(e: Event) => form.amount = handleInputChange(e)" />
    </FormField>
  
    <!-- <FormField class="py-2" label="用户ID" desc="" variant="vertical">
      <XInput v-model="form.userId" placeholder="请输入用户ID" />
    </FormField> -->

    <FormField class="py-2" required
      label="积分券类型" desc="充值积分券类型">
      <XNativeSelect v-model="form.creditsUsageType"
        :options="VOUCHER_TYPE_LIST"
        label-key="label" value-key="value"
      />
    </FormField>
  
    <FormField class="py-2" label="过期时间" desc="" required variant="vertical">
      <div class="flex flex-wrap space-x-2">
        <label class="flex items-center space-x-1 cursor-pointer">
          <input type="radio" name="days" value="7" v-model="form.day" />
          <span>7天</span>
        </label>
      
        <label class="flex items-center space-x-1 cursor-pointer">
          <input type="radio" name="days" value="15" v-model="form.day" />
          <span>15天</span>
        </label>
      
        <label class="flex items-center space-x-1 cursor-pointer">
          <input type="radio" name="days" value="30" v-model="form.day" />
          <span>30天</span>
        </label>
      
        <label class="flex items-center space-x-1 cursor-pointer">
          <input type="radio" name="days" value="45" v-model="form.day" />
          <span>45天</span>
        </label>
      
        <!-- <label class="flex items-center space-x-2 col-span-2">
          <input type="radio" name="days" value="custom" />
          <span>自定义天数</span>
          <XInput class="w-24" placeholder="输入天数" />
        </label> -->
      </div>
    </FormField>
  </form>
</template>

<script setup lang="ts">
import { VOUCHER_TYPE_LIST } from "@3un/utils"

import type { VoucherCreateForm } from '@/inters/voucher'
import { handleInputNumberChange } from '@/utils'

const form = defineModel<VoucherCreateForm>({ required: true })
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <FormField class="py-2" label="金额" desc="" required>
      <XInput
        v-model="form.amount"
        placeholder="请输入金额"
        @input="(e: Event) => form.amount = handleInputNumberChange(e, 0)!"
        @change="(e: Event) => form.amount = handleInputNumberChange(e, 0)!"
      />
    </FormField>
    <FormField class="py-2" label="积分券类型" desc="只允许该积分处理的服务" required>
      <XSelect
        v-model="form.creditsUsageType"
      >
        <XSelectItem
          v-for="item in VOUCHER_TYPE_LIST" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
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
      </div>
    </FormField>
  </form>
</template>

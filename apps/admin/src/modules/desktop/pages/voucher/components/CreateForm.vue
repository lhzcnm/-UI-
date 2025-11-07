<script setup lang="ts">
import type { VoucherCreateForm } from '@/inters/voucher'

const form = defineModel<VoucherCreateForm>({ required: true })
</script>

<template>
  <form class="">
    <FormField class="py-2" label="金额" desc="" required variant="vertical">
      <XInput v-model="form.amount" placeholder="请输入金额" />
    </FormField>
  
    <!-- <FormField class="py-2" label="用户ID" desc="" variant="vertical">
      <XInput v-model="form.userId" placeholder="请输入用户ID" />
    </FormField> -->
  
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

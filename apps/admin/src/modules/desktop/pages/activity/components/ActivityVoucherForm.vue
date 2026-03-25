<script setup lang="ts">
import { type ActivityVoucherCreate } from '@/inters/voucher/activity'
import { twMerge, type ClassNameValue } from 'tailwind-merge'

interface ActivityVoucherFormProps {
  amount: string,
  formClass: ClassNameValue,
}

const props = defineProps<ActivityVoucherFormProps>()

const form = defineModel<ActivityVoucherCreate>({ required: true })

const formClass = computed(() => (twMerge('divide-y', props.formClass)))
</script>

<template>
  <form :class="formClass">
    <FormField class="py-2" label="充值id" desc="" required>
      <XInput disabled v-model="form.paymentId" placeholder="充值ID" />
    </FormField>
    <FormField class="py-2" label="充值金额" desc="" required>
      <XInput disabled v-model="props.amount" placeholder="充值到账金额" />
    </FormField>
    <FormField class="py-2" label="金额" desc="" required>
      <XInput v-model="form.amount" placeholder="请输入金额" />
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

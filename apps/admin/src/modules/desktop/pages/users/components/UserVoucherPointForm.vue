<script setup lang="ts">
import type { UserPointForm } from '@/inters/users'
import { PAYMENT_METHOD } from '@3un/utils'
import { XRadio } from '@3un/ui'

interface UserPointFormProps {
  currentPoint: string
}

defineProps<UserPointFormProps>()
const form = defineModel<UserPointForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-label text-sm mb-1">类型</label>
      <div class="flex space-x-6">
        <XRadio v-model="form.isAdd" :value="true" label="增加" />
        <XRadio v-model="form.isAdd" :value="false" label="扣除" />
      </div>
    </div>

    <div class="flex space-x-2">
      <div class="flex-1">
        <label class="block text-label text-sm mb-1">点数</label>
        <XInputNumber v-model="form.credits" :step="0.01" :precision="2" />
      </div>
      <div class="flex-1">
        <label class="block text-label text-sm mb-1">现有积分</label>
        <XInput :model-value="currentPoint" disabled />
      </div>
    </div>

    <div class="flex space-x-2">
      <div class="flex-1">
        <label class="block text-label text-sm mb-1">付款状态</label>
        <XSelect v-model="form.isPay">
          <XSelectItem :value="false" label="未付款" />
          <XSelectItem :value="true" label="已付款" />
        </XSelect>
      </div>
      <div class="flex-1">
        <label class="block text-label text-sm mb-1">付款方式</label>
        <XSelect v-model="form.paymentMethod" :disabled="!form.isPay">
          <XSelectItem :value="PAYMENT_METHOD.ADMIN" label="管理员充值" />
          <XSelectItem :value="PAYMENT_METHOD.WECHAT" label="微信" />
          <XSelectItem :value="PAYMENT_METHOD.ALIPAY" label="支付宝" />
        </XSelect>
      </div>
    </div>

    <div>
      <label class="block text-label text-sm mb-1">交易ID</label>
      <XInput v-model="form.transactionId" placeholder="交易ID" :disabled="!form.isAdd" />
    </div>

    <div>
      <label class="block text-label text-sm mb-1">备注</label>
      <XTextarea v-model="form.comments" placeholder="备注" />
    </div>
    
    <!-- <div>
      <label class="block text-label text-sm mb-1">生成充值记录</label>
      <XSwitch v-model="form.invoices" />
    </div> -->
  </form>
</template>

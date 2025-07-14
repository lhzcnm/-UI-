<script setup lang="ts">
import type { RechargeUpdateParams } from '@/inters/recharge'
import { PAYMENT_METHOD_LIST, PAYMENT_STATUS_LIST } from '@3un/utils'

const form = defineModel<RechargeUpdateParams>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block mb-1 text-label text-sm">支付状态</label>
      <XNativeSelect
        v-model="form.paymentStatus"
        :options="PAYMENT_STATUS_LIST"
        value-key="value"
        label-key="label"
      />
    </div>
    <div>
      <label class="block mb-1 text-label text-sm">支付方式</label>
      <XNativeSelect
        v-model="form.paymentMethod"
        :options="PAYMENT_METHOD_LIST"
        value-key="value"
        label-key="label"
      />
    </div>
    <div>
      <label class="block mb-1 text-label text-sm">备注</label>
      <XTextarea v-model="form.comments" placeholder="充值备注" />
    </div>
    <div>
      <label class="block mb-1 text-label text-sm">
        管理员添加
      </label>
      <XSwitch v-model="form.byAdmin" />
    </div>
  </form>
</template>

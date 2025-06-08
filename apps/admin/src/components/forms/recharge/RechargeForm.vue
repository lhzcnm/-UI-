<script setup lang="ts">
import type { RechargeUpdateParams } from '@/inters/recharge'
import { PAYMENT_METHOD_LIST, PAYMENT_STATUS_LIST } from '@3un/utils'

const form = defineModel<RechargeUpdateParams>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block mb-1 text-label text-sm">支付状态</label>
      <XSelect v-model="form.paymentStatus">
        <XSelectItem
          v-for="item in PAYMENT_STATUS_LIST" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
    </div>
    <div>
      <label class="block mb-1 text-label text-sm">支付方式</label>
      <XSelect v-model="form.paymentMethod">
        <XSelectItem
          v-for="item in PAYMENT_METHOD_LIST" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
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

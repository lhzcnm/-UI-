<script setup lang="ts">
import { type RechargeHandleFee } from '@/inters/recharge'

const form = defineModel<RechargeHandleFee>({ required: true })

function percentInput(e: Event) {
  const target = e.target as HTMLInputElement
  let s = target.value ?? ''
  s = s.replace(/[^\d.]/g, '')
  s = s.replace(/\.{2,}/g, '.')
  s = s.replace('.', '#').replace(/\./g, '').replace('#', '.')
  s = s.replace(/^(\d+)\.(\d{0,2}).*$/, '$1.$2')
  return s
}

function numberInput(e: Event) {
  const target = e.target as HTMLInputElement
  let s = target.value ?? ''
  return s.replace(/\D/g, '')
}
</script>

<template>
  <form class="divide-y">
    <FormField label="支付宝手续费 (%)" desc="充值手续费比例，例如输入 10 表示收取 10% 的手续费">
      <XInput
        placeholder="请输入手续费比例，如 10 表示 10%"
        v-model="form.aliFee"
        @input="(event: Event) => form.aliFee = percentInput(event)"
        @change="(event: Event) => form.aliFee = percentInput(event)"
      />
    </FormField>

    <FormField label="支付宝免手续费金额" desc="当单次充值金额达到该值时，不收取手续费">
      <XInput
        placeholder="请输入免手续费的最低充值金额"
        v-model="form.aliThreshold"
        @input="(event: Event) => form.aliThreshold = numberInput(event)"
        @change="(event: Event) => form.aliThreshold = percentInput(event)"
      />
    </FormField>

    <FormField label="微信手续费 (%)" desc="充值手续费比例，例如输入 10 表示收取 10% 的手续费">
      <XInput
        placeholder="请输入手续费比例，如 10 表示 10%"
        v-model="form.wxFee"
        @input="(event: Event) => form.wxFee = percentInput(event)"
        @change="(event: Event) => form.wxFee = percentInput(event)"
      />
    </FormField>

    <FormField label="微信免手续费金额" desc="当单次充值金额达到该值时，不收取手续费">
      <XInput
        placeholder="请输入免手续费的最低充值金额"
        v-model="form.wxThreshold"
        @input="(event: Event) => form.wxThreshold = numberInput(event)"
        @change="(event: Event) => form.wxThreshold = percentInput(event)"
      />
    </FormField>
  </form>
</template>

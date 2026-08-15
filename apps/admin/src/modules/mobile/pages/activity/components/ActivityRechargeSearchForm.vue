<script setup lang="ts">
import type { RechargeSearchForm } from '@/inters/recharge'
import { handleInputNumberChange } from '@/utils'

const form = defineModel<RechargeSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-1">用户ID</label>
      <XInput v-model="form.userId" placeholder="用户ID" @input="(e: Event) => form.userId = handleInputNumberChange(e)" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">交易ID</label>
      <XInput v-model="form.transactionId" placeholder="交易ID" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CreditSearchForm } from '@/inters/credits'
import { handleInputNumberChange } from '@/utils'

const form = defineModel<CreditSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-1">服务ID</label>
      <NativeSelectService v-model="form.serviceId" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">用户ID</label>
      <XInput
        v-model.number="form.userId"
        placeholder="用户ID"
        @input="(e: Event) => form.userId = handleInputNumberChange(e)"
        @change="(e: Event) => form.userId = handleInputNumberChange(e)"
      />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">IMEI/SN</label>
      <XTextarea v-model="form.imeiNo" placeholder="IMEI/SN，一行一个" rows="8" />
    </div>
  </form>
</template>

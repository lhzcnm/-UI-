<script setup lang="ts">
import { toast } from 'vue-sonner'
import { XInput } from '@3un/ui'

import { voucherApi, type DecryptParams } from '@/api/voucher'
import { RECHARGE_STORE } from '../utils'

const code = ref<string>('')
const disabled = ref<boolean>(false)
const store = inject(RECHARGE_STORE)!


const localStore = useLocalStore()

function handleRecharge() {
  if(!code.value) return toast.warning(localStore.localData['recharge_InputNo_Toast'])

  disabled.value = true
  const params: DecryptParams = {
    code: code.value.trim(),
  }
  voucherApi.decrypt(params).then(() => {
    toast.success(localStore.localData['recharge_ExchangeSuccess_Toast'])
    store.refresh = !store.refresh
  }).catch(({ message }) => {
    toast.warning(message)
  }).finally(() => {
    disabled.value = false
    code.value = ''
  })
}
</script>

<template>
  <div class="bg-card border p-4 rounded-md space-y-6">
    <div class="space-y-3">
      <h3 class="text-lg font-medium">{{ localStore.localData['recharge_VoucherExchange'] }}</h3>

      <div class="flex items-center space-x-2">
        <XInput
          v-model="code"
          :placeholder="localStore.localData['recharge_VoucherNo']" />
      </div>
    </div>
    <div class="flex items-center justify-end">
      <XButton
        :label="localStore.localData['recharge_ExchangeNow']"
        :disabled
        @click="handleRecharge"
      />
    </div>
  </div>
</template>

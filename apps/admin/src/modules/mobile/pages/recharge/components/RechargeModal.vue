<script setup lang="ts">
import RechargeForm from './RechargeForm.vue'
import { updateRecharge } from '@/api/recharge'
import { RECHARGE_STORE } from '../utils'

const store = inject(RECHARGE_STORE)!
const loading = ref(false)

function handleSubmit() {
  loading.value = true

  const response = updateRecharge(store.formUpdate)

  response.then(() => {
    store.refresh = !store.refresh
    store.visibleUpdate = false
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <TheModal v-model="store.visibleUpdate" title="编辑">
    <RechargeForm
      v-model="store.formUpdate"
      class="px-4"
    />
    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" @click="store.visibleUpdate = false">取消</XButton>
      <XButton :loading="loading" @click="handleSubmit">保存</XButton>
    </div>
  </TheModal>
</template>

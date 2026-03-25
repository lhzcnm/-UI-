<script setup lang="ts">
import { createActivityVoucher } from '@/api/voucher'
import { ACTIVITY_RECHARGE_STORE } from '../utils'
import { toast } from 'vue-sonner'
import ActivityRechargeForm from './ActivityRechargeForm.vue'

const store = inject(ACTIVITY_RECHARGE_STORE)!

const loading = ref<boolean>(false)

function handleClose() {
  store.visibleCreate = false
}

async function handleSubmit() {
  try {
    const { code, message } = await createActivityVoucher(store.formCreate)

    if (code === 200) {
      toast.success("生成成功")
      handleClose()
      store.refresh = !store.refresh
    } else {
      toast.warning(message)
    }
  } catch {  }
}
</script>

<template>
  <XDialog
    v-model="store.visibleCreate"
    draggable
    title="生成券码"
    ui-root="sm:max-w-lg sm:p-0"
    ui-header="p-4 mb-0 border-b"
    @close="handleClose"
  >
    <template #default>
      <ActivityRechargeForm form-class="p-4" v-model="store.formCreate" :amount="store.payment.credits" />
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2 p-4 border-t">
        <XButton variant="soft" @click="handleClose">取消</XButton>
        <XButton :loading @click="handleSubmit">确认</XButton>
      </div>
    </template>
  </XDialog>
</template>

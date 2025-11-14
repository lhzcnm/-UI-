<script setup lang="ts">
import CreateForm from './CreateForm.vue'

import { toast } from 'vue-sonner'

import { createVoucher } from '@/api/voucher'
import { VOUCHER_STORE } from '../utils'
import { zVoucherCreate } from '@/inters/voucher'

const store = inject(VOUCHER_STORE)!

async function handleCreate() {
  if(!store.createForm.amount || store.createForm.amount === 0) {
    return toast.warning("积分券充值金额不能为0")
  }
  
  try {
    await createVoucher(store.createForm)
    store.visibleCreate = false
    store.refresh = true
    toast.success("生成成功")
  } catch {
    toast.error("生成失败, 请重试")
  } finally {
    store.refresh = true
  }
}

function handleClose() {
  store.visibleCreate = false
  store.createForm = zVoucherCreate.parse({})
}
</script>

<template>
  <XDialog
    v-model="store.visibleCreate"
    draggable
    title="生成券码"
    @close="handleClose"
  >
    <template #default>
      <CreateForm v-model="store.createForm" />
    </template>

    <template #footer>
      <div class="mt-2 flex justify-end space-x-2">
        <XButton label="取消" variant="soft" @click="handleClose" />
        <XButton label="确认" @click="handleCreate" />
      </div>
    </template>
  </XDialog>
</template>

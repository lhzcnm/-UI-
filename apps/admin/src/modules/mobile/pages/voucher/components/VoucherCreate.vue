<script setup lang="ts">
import CreateForm from './CreateForm.vue'

import { toast } from 'vue-sonner'

import { createVoucher } from '@/api/voucher'
import { VOUCHER_STORE } from '../utils'
import { zVoucherCreate } from '@/inters/voucher'

const store = inject(VOUCHER_STORE)!

const loading = ref<boolean>(false)

async function handleSubmit() {
  if(!store.createForm.amount || store.createForm.amount === 0) return toast.warning('请输入正确的金额')
  if(!store.createForm.day) return toast.warning('请输入正确的过期时间')
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
  <TheModal
    v-model="store.visibleCreate"
    title="生成积分券"
    @close="handleClose"
  >
    <template #default>
      <CreateForm class="p-4 pt-0" v-model="store.createForm" />
      <div class="flex justify-end space-x-2 p-4 border-t">
        <XButton variant="soft" @click="handleClose">取消</XButton>
        <XButton :loading @click="handleSubmit">生成</XButton>
    </div>
    </template>
  </TheModal>
</template>

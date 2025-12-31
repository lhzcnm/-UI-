<script setup lang="ts">
import { toast } from 'vue-sonner'
import { USER_STORE } from '../utils'
import UserVoucherPointForm from './UserVoucherPointForm.vue'
import { updateUserPoint } from '@/api/users'

const store = inject(USER_STORE)!
const loading = ref<boolean>(false)

async function hadleSubmit() {
  if (store.formPoint.credits === 0) {
    toast.warning("请输入点数")
    return
  }

  try {
    loading.value = true

    await updateUserPoint(store.formPoint)
    store.visibleVoucherPoint = false
    store.refresh = !store.refresh
  } catch {
    // toast.warning("更新积分失败, 请重试")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <XDialog
    v-model="store.visibleVoucherPoint"
    draggable
    title="赠送积分设置"
  >
    <template #default>
      <UserVoucherPointForm
        :current-point="store.users.list[store.index!].voucherCredits"
        v-model="store.formPoint" />
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton :loading="loading" variant="soft" @click="store.visibleVoucherPoint = false" label="取消" />
        <XButton :loading="loading" @click="hadleSubmit" label="提交" />
      </div>
    </template>
  </XDialog>
</template>

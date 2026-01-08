<script setup lang="ts">
import UserPointForm from './UserPointForm.vue'

import { toast } from 'vue-sonner'

import { updateUserPoint } from '@/api/users'
import { USER_STORE } from '../utils'

const store = inject(USER_STORE)!
const loading = ref(false)

function handleSubmit() {
  if (store.formPoint.credits === 0) {
    toast.warning('请先输入点数')
    return
  }

  loading.value = true

  const response = updateUserPoint(store.formPoint)
  response.then(() => {
    store.refresh = !store.refresh
    store.visiblePoint = false
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <XDialog v-model="store.visiblePoint" draggable title="积分设置">
    <UserPointForm
      v-model="store.formPoint"
      :current-point="store.currentCredits"
    />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visiblePoint = false">取消</XButton>
        <XButton :loading="loading" @click="handleSubmit">提交</XButton>
      </div>
    </template>
  </XDialog>
</template>

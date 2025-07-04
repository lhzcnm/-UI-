<script setup lang="ts">
import UserPointForm from './UserPointForm.vue'

import { toast } from 'vue-sonner'

import { updateUserPoint } from '@/api/users'
import { USER_STORE } from '../utils'

const store = inject(USER_STORE)!

const loading = ref(false)

const user = computed(() => store.users.list[store.index!])

function handleSubmit() {
  if (store.formPoint.credits === 0) {
    return toast.warning('请先输入点数')
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
  <TheModal
    v-model="store.visiblePoint"
    title="积分设置"
  >
    <UserPointForm
      v-model="store.formPoint"
      :current-point="user.credits"
      class="px-4"
    />

    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" @click="store.visiblePoint = false">取消</XButton>
      <XButton :loading="loading" @click="handleSubmit">提交</XButton>
    </div>
  </TheModal>
</template>

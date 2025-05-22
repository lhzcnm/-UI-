<script setup lang="ts">
import UserPointForm from '@forms/users/UserPointForm.vue'
import { USER_STORE } from '../utils'

const store = inject(USER_STORE)!
const loading = ref(false)

function handleSubmit() {
  loading.value = true
}
</script>

<template>
  <XDialog v-model="store.visiblePoint" title="积分设置" @submit="handleSubmit">
    <UserPointForm v-model="store.formPoint" />
    <template #footer>
      <div class="flex justify-end">
        <XButton variant="soft" @click="store.visiblePoint = false">取消</XButton>
        <XButton :loading="loading" @click="handleSubmit">提交</XButton>
      </div>
    </template>
  </XDialog>
</template>

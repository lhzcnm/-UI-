<script setup lang="ts">
import UserSearchForm from '@forms/users/UserSearchForm.vue'
import { USER_STORE } from '../utils'

const store = inject(USER_STORE)!

function handleSubmit() {
  store.visibleSearch = false
  store.refresh = !store.refresh
  store.page = 1
}
</script>

<template>
  <XDialog v-model="store.visibleSearch" title="搜索用户">
    <UserSearchForm v-model="store.formSearch" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleSearch = false">取消</XButton>
        <XButton @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>

<script setup lang="ts">
import LogSearchForm from '@forms/LogSearchForm.vue'
import { LOG_STORE } from '../utils'

const store = inject(LOG_STORE)!
function handleSubmit() {
  store.visibleSearch = false
  store.refresh = !store.refresh
  store.page = 1
}
</script>

<template>
  <XDialog v-model="store.visibleSearch" title="搜索用户">
    <LogSearchForm v-model="store.formSearch" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleSearch = false">取消</XButton>
        <XButton @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>

<script setup lang="ts">
import LogSearchForm from './LogSearchForm.vue'
import { useCopy } from '@3un/utils'
import { LOG_STORE } from '../utils'

const store = inject(LOG_STORE)!
const cloned = useCopy(store.formSearch)
const copied = ref(cloned())

function handleSubmit() {
  store.formSearch = copied.value
  store.visibleSearch = false
  store.refresh = !store.refresh
  store.page = 1
}

function handleCancel() {
  copied.value = cloned()
  store.visibleSearch = false
}
</script>

<template>
  <XDialog v-model="store.visibleSearch" draggable title="搜索用户">
    <LogSearchForm v-model="copied" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="handleCancel">取消</XButton>
        <XButton @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>

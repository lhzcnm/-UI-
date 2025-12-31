<script setup lang="ts">
import { ACTIVITY_STORE } from '../utils'
import ActivitySearchForm from './ActivitySearchForm.vue'

const store = inject(ACTIVITY_STORE)!

function handleSubmit() {
  store.visibleSearch = false
  store.refresh = !store.refresh
}
</script>

<template>
  <XDialog
    v-model="store.visibleSearch"
    draggable
    title="活动筛选"
    ui-root="sm:max-w-md"
  >
    <template #default>
      <ActivitySearchForm v-model="store.formSearch" />
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 mt-2">
        <XButton variant="soft" label="取消" @click="store.visibleSearch = false" />
        <XButton label="提交" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

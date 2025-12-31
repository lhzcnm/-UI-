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
  <TheModal
    v-model="store.visibleSearch"
    title="筛选"
    class="flex flex-col"
    header-class="border-b">
    <template #default>
      <div class="p-4 flex flex-col overflow-auto">
        <ActivitySearchForm class="overflow-y-auto border-b pb-4" v-model="store.formSearch" />
        <div class="flex justify-end space-x-2 mt-2">
          <XButton variant="soft" label="取消" @click="store.visibleSearch = false" />
          <XButton label="提交" @click="handleSubmit" />
        </div>
      </div>
    </template>
  </TheModal>
</template>

<script setup lang="ts">
import ServerSearchForm from './ServerSearchForm.vue'

import { MONITOR_SERVER_STORE } from '../utils'

const store = inject(MONITOR_SERVER_STORE)!

function handleSubmit() {
  store.refresh = !store.refresh
  store.visibleSearch = false
}
</script>

<template>
  <XDialog
    v-model="store.visibleSearch"
    title="筛选"
    draggable
    ui-root="sm:p-0 sm:max-w-md"
    ui-header="p-4 mb-0 border-b"
  >
    <template #default>
      <ServerSearchForm class="p-4" v-model="store.formSearch" />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2 border-t">
        <XButton variant="soft" label="取消" @click="store.visibleSearch = false" />
        <XButton label="提交" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

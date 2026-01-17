<script setup lang="ts">
import ServerSearchForm from './ServerSearchForm.vue'

import { MONITOR_SERVER_STORE } from '../utils'
import { useCopyFn } from '@3un/utils'

const store = inject(MONITOR_SERVER_STORE)!

const cloned = useCopyFn(() => store.formSearch)
const copied = ref(cloned())

watch(
  () => store.visibleSearch,
  (val) => val && (copied.value = cloned()),
)

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
  <XDialog
    v-model="store.visibleSearch"
    title="筛选"
    draggable
    ui-root="sm:p-0 sm:max-w-md"
    ui-header="p-4 mb-0 border-b"
    @close="handleCancel"
  >
    <template #default>
      <ServerSearchForm class="p-4" v-model="copied" />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2 border-t">
        <XButton variant="soft" label="取消" @click="handleCancel" />
        <XButton label="提交" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

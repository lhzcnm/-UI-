<script setup lang="ts">
import ActivitySearchForm from './ActivitySearchForm.vue'

import { ACTIVITY_STORE } from '../utils'
import { useCopyFn } from '@3un/utils'

const store = inject(ACTIVITY_STORE)!

const cloned = useCopyFn(() => store.formSearch)
const copied = ref(cloned())

watch(
  () => store.visibleSearch,
  (val) => val && (copied.value = cloned()),
)

function handleCancel() {
  copied.value = cloned()
  store.visibleSearch = false
}

function handleSubmit() {
  store.formSearch = copied.value
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
    @close="handleCancel"
  >
    <template #default>
      <ActivitySearchForm v-model="copied" />
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 mt-2">
        <XButton variant="soft" label="取消" @click="handleCancel" />
        <XButton label="提交" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

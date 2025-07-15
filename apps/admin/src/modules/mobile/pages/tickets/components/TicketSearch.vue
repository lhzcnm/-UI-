<script setup lang="ts">
import TicketSearchForm from './TicketSearchForm.vue'
import { useCopyFn } from '@3un/utils'
import { TICKET_STORE } from '../utils'

const store = inject(TICKET_STORE)!
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
  <TheModal v-model="store.visibleSearch" title="搜索用户">
    <TicketSearchForm v-model="copied" :type-list="store.types" class="px-4" />
    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" @click="handleCancel">取消</XButton>
      <XButton @click="handleSubmit">搜索</XButton>
    </div>
  </TheModal>
</template>

<script setup lang="ts">
import TicketSearchForm from '@forms/tickets/TicketSearchForm.vue'
import { TICKET_STORE } from '../utils'

const store = inject(TICKET_STORE)!
function handleSubmit() {
  store.visibleSearch = false
  store.refresh = !store.refresh
  store.page = 1
}
</script>

<template>
  <XDialog v-model="store.visibleSearch" title="搜索用户">
    <TicketSearchForm v-model="store.formSearch" :type-list="store.types" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleSearch = false">取消</XButton>
        <XButton @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>

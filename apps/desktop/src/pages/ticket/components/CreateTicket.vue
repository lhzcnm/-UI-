<script setup lang="ts">
import BaseTicketForm from './BaseTicketForm.vue'
import { TICKET_STORE } from '../utils'
import ticketApi from '@/api/tickets'

const store = inject(TICKET_STORE)!
const submitLoading = ref(false)

function handleSubmit() {
  submitLoading.value = true

  const response = ticketApi.create(store.createForm)
  response.then(({ data }) => {
    store.tickets.unshift(data)
    store.visibleCreate = false
  })

  response.finally(() => {
    submitLoading.value = false
  })
}
</script>

<template>
  <XDialog
    v-model="store.visibleCreate"
    :close-on-escape="false"
    :interact="false"
    title="创建工单"
  >
    <BaseTicketForm v-model="store.createForm" />

    <template #footer>
      <div class="flex justify-end gap-2 mt-4">
        <XButton variant="secondary" @click="store.visibleCreate = false">取消</XButton>
        <XButton color="blue" :loading="submitLoading" @click="handleSubmit">提交</XButton>
      </div>
    </template>
  </XDialog>
</template>

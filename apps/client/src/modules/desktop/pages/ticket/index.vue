<script setup lang="ts">
import ListPlane from './components/ListPlane.vue'
import ReplyPlane from './components/ReplyPlane.vue'
import CreateTicket from './components/CreateTicket.vue'

import type { TicketStore } from './utils'
import { TICKET_STORE, form } from './utils'
import { ticketApi } from '@/api/tickets'

const store: TicketStore = reactive({
  tickets: [],
  replies: [],
  types: [],
  createForm: form.create,
  visibleCreate: false,
  index: undefined,
})

provide(TICKET_STORE, store)

await Promise.all([
  getList(),
  getTypes(),
])

async function getList() {
  store.tickets = (await ticketApi.list()).data
}

async function getTypes() {
  store.types = (await ticketApi.issueList()).data

  store.createForm.type = store.types[0]?.departmentId
}
</script>

<template>
  <div class="flex space-x-3 p-4 h-full">
    <ReplyPlane class="min-w-[36rem]" />
    <ListPlane class="w-[350px]" />
    <CreateTicket />
  </div>
</template>

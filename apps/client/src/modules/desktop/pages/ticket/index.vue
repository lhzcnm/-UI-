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
  createForm: form.create,
  visibleCreate: false,
  index: undefined,
})

provide(TICKET_STORE, store)

await getList()
async function getList() {
  const { data } = await ticketApi.list()
  store.tickets = data
}
</script>

<template>
  <div class="flex space-x-3 p-4 h-full">
    <ReplyPlane class="min-w-[36rem]" />
    <ListPlane class="w-[350px]" />
    <CreateTicket />
  </div>
</template>

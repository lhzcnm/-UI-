<script setup lang="ts">
import { TICKET_STORE, form } from '../utils'
import { ticketApi } from '@/api/tickets'

const store = inject(TICKET_STORE)!
const route = useRoute()

const localStore = useLocalStore()

watch(
  () => route.query,
  (query) => {
    if (!query.ticketId) return
    const index = store.tickets
      .findIndex(t => t.id === Number(query.ticketId))

    if (index !== -1) checkoutTicket(index)
  },
  { immediate: true },
)

function handleCreate() {
  store.createForm = { ...form.create }
  store.visibleCreate = true
}

function checkoutTicket(index: number) {
  store.index = index

  const response = ticketApi.replys(store.tickets[index].id)
  response.then(({ data }) => store.replies = data)
}

function getTicketType(type: number) {
  return store.types.find(t => t.departmentId === type)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <section class="px-2">
      <XButton :label="localStore.localData['ticket_new']" @click="handleCreate" />
    </section>

    <section class="flex-1 space-y-2 mt-4 px-2 pt-1 overflow-y-auto">
      <div v-if="store.tickets.length === 0" class="flex items-center justify-center h-36">
        <span class="text-sm text-muted-foreground">{{ localStore.localData['ticket_dataNull'] }}</span>
      </div>

      <TicketCard
        v-for="(ticket, index) in store.tickets" :key="ticket.id"
        :ticket="ticket"
        :active="store.index === index"
        :type="getTicketType(ticket.type)"
        @click="checkoutTicket(index)"
      />
    </section>
  </div>
</template>

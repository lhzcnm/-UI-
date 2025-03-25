<script setup lang="ts">
import { TICKET_STORE, form } from '../utils'
import { ticketApi } from '@/api/tickets'

const store = inject(TICKET_STORE)!

function handleCreate() {
  store.createForm = { ...form.create }
  store.visibleCreate = true
}

function checkoutTicket(index: number) {
  store.index = index

  const response = ticketApi.replys(store.tickets[index].id)
  response.then(({ data }) => store.replies = data)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <section class="px-2">
      <XButton label="新增工单" @click="handleCreate" />
    </section>

    <section class="flex-1 space-y-2 mt-4 px-2 pt-1 overflow-y-auto">
      <div v-if="store.tickets.length === 0" class="flex items-center justify-center h-36">
        <span class="text-sm text-muted-foreground">暂无工单</span>
      </div>

      <TicketCard
        v-for="(ticket, index) in store.tickets" :key="ticket.id"
        :ticket="ticket" :active="store.index === index"
        @click="checkoutTicket(index)"
      />
    </section>
  </div>
</template>

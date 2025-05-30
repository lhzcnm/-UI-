<script setup lang="ts">
import TicketCard from './TicketCard.vue'

import { TICKET_STORE } from '../utils'
import { getTicketReplies } from '@/api/ticket'

const store = inject(TICKET_STORE)!

function checkoutTicket(index: number) {
  const ticket = store.tickets.list[index]
  const response = getTicketReplies(ticket.id)
  response.then((data) => {
    store.replies = data
    store.index = index
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <h2 class="px-1 text-lg font-bold">工单列表</h2>

    <section class="flex-1 space-y-2 mt-2 p-1 overflow-y-auto">
      <div v-if="store.tickets.total === 0" class="flex items-center justify-center h-36">
        <span class="text-sm text-muted-foreground">暂无工单</span>
      </div>

      <TicketCard
        v-for="(ticket, index) in store.tickets.list" :key="ticket.id"
        :ticket="ticket" :active="store.index === index"
        @click="checkoutTicket(index)"
      />
    </section>

    <section class="flex justify-between items-center px-1 pt-2">
      <span class="text-sm text-muted-foreground">
        {{ store.tickets.total }} 条工单
      </span>
      <XSimplePagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="store.tickets.total"
      />
    </section>
  </div>
</template>

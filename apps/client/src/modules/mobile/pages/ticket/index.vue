<script setup lang="ts">
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

const visibleReply = ref(false)

const { t } = useI18n()

await Promise.all([
  getList(),
  getTypes(),
])

async function getList() {
  store.tickets = (await ticketApi.list()).data
}

async function getTypes() {
  const { data } = await ticketApi.issueList()

  store.types = data
  // store.types = data.map(item =>({
  //   id: item.departmentId,
  //   label: t(TICKET_TYPE_MAP[item.departmentId].key!),
  // }))
}

function checkoutTicket(index: number) {
  store.index = index
  visibleReply.value = true

  const response = ticketApi.replys(store.tickets[index].id)
  response.then(({ data }) => store.replies = data)
}

function getTicketType(type: number) {
  return store.types.find(t => t.departmentId === type)
}
</script>

<template>
  <div class="p-3">
    <section class="bg-card border rounded-lg p-3 mb-3">
      <XButton :label="t('ticket.button')" @click="store.visibleCreate = true" />
    </section>

    <section class="space-y-3">
      <NoMessage
        v-if="store.tickets.length === 0"
        class="bg-card border rounded-lg p-3"
      />
      <template v-else>
        <TicketCard
          v-for="(ticket, index) in store.tickets" :key="ticket.id"
          :ticket="ticket"
          :active="store.index === index"
          :type="getTicketType(ticket.type)"
          @click="checkoutTicket(index)"
        />
      </template>
    </section>

    <CreateTicket />
    <ReplyPlane v-model="visibleReply" />
  </div>
</template>

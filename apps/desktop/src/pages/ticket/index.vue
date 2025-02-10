<script setup lang="ts">
import TicketListPlane from './components/TicketListPlane.vue'
import TicketReplyPlane from './components/TicketReplyPlane.vue'
import CreateTicket from './components/CreateTicket.vue'

import type { TicketStore } from './utils'
import { TICKET_STORE, form } from './utils'

const store: TicketStore = reactive({
  tickets: [],
  replies: [],
  createForm: form.create,
  visibleCreate: false,
  index: undefined,
})

provide(TICKET_STORE, store)
</script>

<template>
  <div class="flex gap-4 h-full">
    <TicketListPlane />
    <TicketReplyPlane />
    <CreateTicket />
  </div>
</template>

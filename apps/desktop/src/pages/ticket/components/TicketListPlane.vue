<script setup lang="ts">
import { TICKET_STATUS_MAP, TICKET_PRIORITY_MAP, TICKET_TYPE_MAP } from '@3un/utils'
import { TICKET_STORE, form } from '../utils'
import ticketApi from '@/api/tickets'

const store = inject(TICKET_STORE)!

// await getList()
async function getList() {
  const { data } = await ticketApi.list()
  store.tickets = data
}

function handleCreate() {
  store.createForm = { ...form.create }
  store.visibleCreate = true
}
</script>

<template>
  <div class="w-96 flex flex-col h-full">
    <section class="flex items-center p-3 bg-card border rounded-lg">
      <XButton label="新增工单" @click="handleCreate" />
    </section>

    <section class="flex-1 flex flex-col gap-4 mt-4 bg-card border rounded-lg p-4 overflow-y-auto">
      <div v-if="store.tickets.length === 0" class="flex items-center justify-center h-36">
        <span class="text-sm text-muted-foreground">暂无工单</span>
      </div>
      <div
        v-for="ticket in store.tickets" :key="ticket.id"
        class="flex flex-col gap-2 pb-2 border-b"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">{{ ticket.subject }}</div>
          <XTag v-bind="TICKET_STATUS_MAP[ticket.statusId]" />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs">
            <span class="text-emerald-500 bg-emerald-500/10 px-1.5 py-1 rounded">
              {{ TICKET_TYPE_MAP[ticket.type].label }}
            </span>
            <span class="text-emerald-500 bg-emerald-500/10 px-1.5 py-1 rounded">
              {{ TICKET_PRIORITY_MAP[ticket.priority].label }}
            </span>
          </div>
          <span class="text-xs text-muted-foreground">{{ ticket.time }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

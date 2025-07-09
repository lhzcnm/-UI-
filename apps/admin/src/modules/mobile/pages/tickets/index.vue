<script setup lang="ts">
import ReplyPlane from './components/ReplyPlane.vue'
import TicketSearch from './components/TicketSearch.vue'
import TicketType from './components/TicketType.vue'
import TicketCard from './components/TicketCard.vue'

import type { TicketListParams } from '@/inters/ticket'
import { getTicketReplies, getTickets, getTicketTypes } from '@/api/ticket'
import { zTicketType } from '@/inters/ticket'
import { createList } from '@/utils'

import type { TicketStore } from './utils'
import { TICKET_STORE } from './utils'

const store: TicketStore = reactive({
  tickets: createList(),
  replies: [],
  types  : [],

  formSearch: { status: -1, priority: -1, type: undefined },
  formType: zTicketType.parse({}),

  visibleSearch: false,
  visibleType: false,
  visibleReply: false,

  refresh: false,
  index  : undefined,
  limit  : 20,
  page   : 1,
})

provide(TICKET_STORE, store)

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([pageValue, limitValue]) => {
    getList({
      pageSize: limitValue,
      page: pageValue,
      ...store.formSearch,
    })

    store.index = undefined
    store.replies = []
  },
  { immediate: true },
)

await getTypes()

function getList(params: TicketListParams) {
  let { status, priority } = store.formSearch
  if (status === -1) status = undefined
  if (priority === -1) priority = undefined

  const response = getTickets({ ...params, status, priority })
  response.then((data) => store.tickets = data)
}

async function getTypes() {
  const data = await getTicketTypes()
  store.types = data
}

function checkoutTicket(index: number) {
  const ticket = store.tickets.list[index]
  const response = getTicketReplies(ticket.id)
  response.then((data) => {
    store.visibleReply = true
    store.replies = data
    store.index = index
  })
}

function resetSearch() {
  store.formSearch = {
    type: undefined,
    status: -1,
    priority: -1,
  }

  store.page = 1
  store.refresh = !store.refresh
}
</script>

<template>
  <div>
    <Toolbar>
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="store.tickets.total"
      />

      <template #extra>
        <div class="flex items-center">
          <XButton
            label="筛选"
            class="mr-2"
            icon="lucide:filter"
            @click="store.visibleSearch = true"
          />
          <XButton
            label="清空筛选"
            variant="outline"
            icon="lucide:x"
            @click="resetSearch"
          />
  
          <hr class="h-6 w-px mx-4 bg-border" />
  
          <XButton
            icon="lucide:list" label="常见问题"
            @click="store.visibleType = true"
          />
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <div
        v-if="store.tickets.total === 0"
        class="flex items-center justify-center h-36"
      >
        <span class="text-sm text-muted-foreground">暂无工单</span>
      </div>

      <TicketCard
        v-for="(ticket, index) in store.tickets.list" :key="ticket.id"
        :ticket="ticket" :active="store.index === index"
        @click="checkoutTicket(index)"
      />
    </section>

    <ReplyPlane v-model="store.visibleReply" />

    <TicketSearch />
    <TicketType />
  </div>
</template>

<script setup lang="ts">
import ListPlane from './components/ListPlane.vue'
import ReplyPlane from './components/ReplyPlane.vue'
import TicketSearch from './components/TicketSearch.vue'
import TicketType from './components/TicketType.vue'

import { zTicketType, type TicketListParams } from '@/inters/ticket'
import { getTickets, getTicketTypes } from '@/api/ticket'

import type { TicketStore } from './utils'
import { TICKET_STORE } from './utils'

const store: TicketStore = reactive({
  tickets: { list: [], total: 0, page: 1, pageSize: 20 },
  formSearch: { status: -1, priority: -1, type: undefined },
  formType: zTicketType.parse({}),
  visibleSearch: false,
  visibleType: false,
  replies: [],
  types: [],

  index: undefined,
  refresh: false,
  limit: 20,
  page: 1,
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

getTypes()

function getList(params: TicketListParams) {
  let { status, priority } = store.formSearch
  if (status === -1) status = undefined
  if (priority === -1) priority = undefined

  const response = getTickets({ ...params, status, priority })
  response.then((data) => store.tickets = data)
}

function getTypes() {
  const response = getTicketTypes()
  response.then((data) => store.types = data)
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
  <div class="h-full">
    <section class="flex justify-between p-3 border-b">
      <div class="space-x-2">
        <XButton
          icon="lucide:search" color="success"
          @click="store.visibleSearch = true"
        >
          搜索
        </XButton>
        <XButton
          icon="lucide:trash" color="warning"
          @click="resetSearch"
        >
          清空筛选
        </XButton>
      </div>

      <XButton
        icon="lucide:list"
        @click="store.visibleType = true"
      >
        常见问题
      </XButton>
    </section>

    <div class="flex space-x-3 p-3 h-[calc(100vh-7.125rem)]">
      <ListPlane class="w-[350px]" />
      <ReplyPlane class="min-w-[36rem]" />
    </div>

    <TicketSearch />
    <TicketType />
  </div>
</template>

<script setup lang="ts">
import { TICKET_STATUS_MAP } from '@3un/utils'
import { twJoin } from 'tailwind-merge'

import type { Ticket } from '@/inters/ticket'
import { TICKET_STORE } from '../utils'

interface TicketItemProps {
  ticket: Ticket
  active: boolean
}

const props = defineProps<TicketItemProps>()
const store = inject(TICKET_STORE)!

const ticketType = computed(() => store.types.find(t => t.departmentId === props.ticket.type))

function getAvatar(headImgUrl: string | null) {
  if (headImgUrl) return headImgUrl

  const mode = import.meta.env.VITE_APP_MODE
  return `/${mode}/default_avatar.jpg`
}
</script>

<template>
  <a
    href="javascript:void(0)"
    :class="twJoin(
      'block p-3 bg-card border rounded-lg',
      'dark:hover:border-hover transition-colors hover:shadow',
      active && 'ring-2 ring-primary bg-primary/20'
    )"
  >
    <div class="flex items-center space-x-2">
      <h3 class="flex-1 flex items-center">
        <img
          :src="getAvatar(ticket.headImgUrl)" alt=""
          class="size-5 rounded-full"
        >
        <span class="ml-2">{{ ticket.userName }}</span>
      </h3>
      <XTag v-bind="TICKET_STATUS_MAP[ticket.statusId]" />
    </div>

    <div class="text-sm my-2">{{ ticket.subject }}</div>
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center space-x-2">
        <span class="size-1.5 bg-primary rounded-full" />
        <span class="text-muted-foreground">
          {{ ticketType ? ticketType.departmentName : '未知' }}
        </span>
      </div>
      <span class="text-muted-foreground">
        {{ ticket.time }}
      </span>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { TicketItem } from '@/api/tickets'

import { TICKET_STATUS_MAP, TICKET_TYPE_MAP, TICKET_TYPE } from '@3un/shared/enums'
import { twJoin } from 'tailwind-merge'

interface TicketItemProps {
  ticket: TicketItem
  active: boolean
}

defineProps<TicketItemProps>()
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
    <div class="flex items-center justify-between mb-3">
      <h3 class="flex-1 truncate">{{ ticket.subject }}</h3>
      <XTag v-bind="TICKET_STATUS_MAP[ticket.statusId]" />
    </div>
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center space-x-2">
        <span
          class="size-1.5 rounded-full"
          :class="{
            'bg-emerald-500': ticket.type === TICKET_TYPE.RECHARGE,
            'bg-blue-500': ticket.type === TICKET_TYPE.ORDER
          }"
        ></span>
        <span class="text-muted-foreground">
          {{ TICKET_TYPE_MAP[ticket.type].label }}
        </span>
      </div>
      <span class="text-muted-foreground">
        {{ ticket.time }}
      </span>
    </div>
  </a>
</template>

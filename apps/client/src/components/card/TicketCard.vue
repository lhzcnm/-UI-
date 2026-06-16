<script setup lang="ts">
import type { TicketItem, TicketType } from '@/api/tickets'
import { TICKET_STATUS_MAP_LOCALE } from '@3un/utils'

import { twJoin } from 'tailwind-merge'

interface TicketItemProps {
  type: TicketType | undefined
  ticket: TicketItem
  active: boolean
}

const props = defineProps<TicketItemProps>()

const { locale } = useI18n()
const localStore = useLocalStore()

const departName = computed(() => {
  if(!props.type) return ''

  let res = props.type.departmentName

  if(props.type.departmentNameEn && locale.value === 'en') {
    res = props.type.departmentNameEn
  }

  return res

})
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
      <XTag :color="TICKET_STATUS_MAP_LOCALE[ticket.statusId].color" :label="localStore.localData[TICKET_STATUS_MAP_LOCALE[ticket.statusId].key!]" />
    </div>
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center space-x-2">
        <span class="size-1.5 bg-primary rounded-full" />
        <span class="text-muted-foreground">
          {{ type ? departName : localStore.localData['submit_Unknow'] }}
        </span>
      </div>
      <span class="text-muted-foreground">
        {{ ticket.time }}
      </span>
    </div>
  </a>
</template>

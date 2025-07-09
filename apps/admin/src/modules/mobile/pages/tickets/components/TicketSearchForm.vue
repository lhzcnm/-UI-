<script setup lang="ts">
import type { TicketSearch, TicketType } from '@/inters/ticket'
import { TICKET_STATUS_LIST, TICKET_PRIORITY_LIST } from '@3un/utils'

interface TicketSearchProps {
  typeList: TicketType[]
}

const props = defineProps<TicketSearchProps>()
const form = defineModel<TicketSearch>({ required: true })

const ticketStatusList = [
  { value: -1, label: '全部' },
  ...TICKET_STATUS_LIST,
]

const ticketPriorityList = [
  { value: -1, label: '全部' },
  ...TICKET_PRIORITY_LIST,
]
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-1">工单类型</label>
      <XNativeSelect
        v-model="form.type"
        :options="props.typeList"
        placeholder="选择工单类型"
        value-key="departmentId"
        label-key="departmentName"
      />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">工单状态</label>
      <XSegmented
        v-model="form.status!"
        :options="ticketStatusList"
      />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">工单优先级</label>
      <XSegmented
        v-model="form.priority!"
        :options="ticketPriorityList"
      />
    </div>
  </form>
</template>

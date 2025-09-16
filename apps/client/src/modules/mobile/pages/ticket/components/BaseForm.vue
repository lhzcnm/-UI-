<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { TicketCreateForm, TicketType } from '@/api/tickets'
import { TICKET_TYPE, TICKET_PRIORITY_LIST } from '@3un/utils'

interface BaseFormProps {
  typeList: TicketType[]
}

interface TicketOptions {
  value: number,
  label: string,
}

defineProps<BaseFormProps>()
const form = defineModel<TicketCreateForm>({ required: true })

const ticketOptions = reactive<TicketOptions[]>([])

const { t } = useI18n()

function handleOptions() {
  for(let item of TICKET_PRIORITY_LIST) {
    ticketOptions.push({
      value: item.value,
      label: t(item.key)
    })
  }
}

handleOptions()
</script>

<template>
  <form class="space-y-3" @submit.prevent>
    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.type') }}</label>
      <XNativeSelect
        v-model="form.type"
        :options="typeList"
        :default="TICKET_TYPE.ORDER"
        value-key="id"
        label-key="label"
      />
    </div>

    <div class="space-y-1 flex flex-col">
      <label class="text-label text-sm">{{ t('ticket.form.level') }}</label>
      <!-- <XNativeSelect
        v-model="form.priority"
        :options="TICKET_PRIORITY_LIST"
        :default="TICKET_PRIORITY.MEDIUM"
        value-key="value"
        label-key="label"
      /> -->
      <div class="flex-1 relative">
        <Icon 
          icon="lucide:chevron-down" :width="20"
          class="
            absolute right-2 top-1/2 transform -translate-y-1/2
            pointer-events-none text-muted-foreground bg-card
          "
        />
        <select
          class="w-full h-10 border rounded px-2 appearance-none ring-1 ring-input outline-none focus:ring-primary"
          v-model="form.priority"
        >
          <option
            v-for="option in ticketOptions" :key="option.label"
            :value="option.value"
          >{{ option.label }}</option>
        </select>
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.topic') }}</label>
      <XInput v-model="form.subject" :placeholder="t('ticket.placeholder.topic')" />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.msg') }}</label>
      <XTextarea v-model="form.msg" rows="5" :placeholder="t('ticket.placeholder.msg')" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Ticket, TicketForm } from '@/inters/ticket'
import { TICKET_PRIORITY_LIST } from '@3un/utils'

interface RefundFormProps {
  tickets: Ticket[],
}

defineProps<RefundFormProps>()

const { t, locale } = useI18n()

const form = defineModel<TicketForm>({required: true})

function handleDepartName(item: Ticket) {
  let res = item.departmentName

  if(locale.value === 'en' && item.departmentNameEn) {
    res = item.departmentNameEn
  }

  return res
}
</script>

<template>
  <form class="p-4 flex flex-col space-y-4" @submit.prevent>
    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.type') }}</label>
      <XSelect v-model="form.type">
        <XSelectItem
          v-for="item in tickets" :key="item.departmentId"
          :value="item.departmentId" :label="handleDepartName(item)"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.level') }}</label>
      <XSelect v-model="form.priority">
        <XSelectItem
          v-for="item in TICKET_PRIORITY_LIST" :key="item.value"
          :value="item.value" :label="t(item.key!)"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.topic') }}</label>
      <XInput v-model="form.subject" :placeholder="t('ticket.prompt.subject')" />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.msg') }}</label>
      <XTextarea v-model="form.msg" rows="5" :placeholder="t('ticket.prompt.msg')" />
    </div>
  </form>
</template>

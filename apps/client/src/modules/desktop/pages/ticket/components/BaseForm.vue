<script setup lang="ts">
import type { TicketCreateForm, TicketType } from '@/api/tickets'
import { TICKET_PRIORITY_LIST, TICKET_TYPE_MAP } from '@3un/utils'

interface BaseFormProps {
  typeList: TicketType[]
}

const props = defineProps<BaseFormProps>()
const form = defineModel<TicketCreateForm>({ required: true })

const { t } = useI18n()
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.type') }}</label>
      <XSelect v-model="form.type" :placeholder="t('ticket.placeholder.select')">
        <XSelectItem
          v-for="item in props.typeList" :key="item.departmentId"
          :value="item.departmentId" :label="t(TICKET_TYPE_MAP[item.departmentId].key!)"
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
      <XInput v-model="form.subject" :placeholder="t('ticket.placeholder.topic')" />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('ticket.form.msg') }}</label>
      <XTextarea v-model="form.msg" rows="5" :placeholder="t('ticket.placeholder.msg')" />
    </div>
  </form>
</template>

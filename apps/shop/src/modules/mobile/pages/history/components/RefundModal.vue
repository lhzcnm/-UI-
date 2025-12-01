<script setup lang="ts">
import TheModal from '@mobile/components/TheModal.vue'
import RefundForm from './RefundForm.vue'

import { HISTORY_STORE } from '../utils'
import type { TicketForm } from '@/inters/ticket'
import { TICKET_PRIORITY } from '@3un/utils'
import { validate, type ValidRule } from '@/utils/validate'
import { createTicket } from '@/api/shop'
import { toast } from 'vue-sonner'

const store = inject(HISTORY_STORE)!

const loading = ref<boolean>(false)

const form = reactive<TicketForm>({
  priority: TICKET_PRIORITY.MEDIUM,
  type: 0,
  subject: '',
  msg: '',
})

const { t } = useI18n()

watch(
  () => store.orderId,
  (value) => {
    form.msg = t('ticket.form.codeId', { id: value })
  }
)

function handleSubmit() {
  const rules: ValidRule[] = [
    {
      rule: !!form.type,
      message: t('ticket.prompt.type'),
    },
    {
      rule: !!form.subject,
      message: t('ticket.prompt.subject'),
    },
    {
      rule: !!form.msg,
      message: t('ticket.prompt.msg'),
    },
  ]
  if(!validate(rules)) return
  
  loading.value = true
  createTicket({ ...form, msg: t('ticket.form.codeId', { id: store.orderId, msg: form.msg }) }).then(() => {
    toast.success(t('ticket.prompt.success'))
  }).catch((err) => {
    console.error(err)
    toast.error(t('ticket.prompt.fail'))
  }).finally(() => {
    loading.value = false
    store.visibleTicket = false
  })
}

function handleClose() {
  store.visibleTicket = false
  store.orderId = undefined
  const init = {
    priority: TICKET_PRIORITY.MEDIUM,
    type: undefined,
    subject: '',
    msg: '',
  }

  Object.assign(form, init)
}
</script>

<template>
  <TheModal
    v-model="store.visibleTicket"
    :title="t('ticket.title.create')"
    @close="handleClose"
  >
    <template #default>
      <RefundForm v-model="form" :tickets="store.tickets" />
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2 py-2 px-4">
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="handleClose" @confirm="handleSubmit"
        />
      </div>
    </template>
  </TheModal>
</template>

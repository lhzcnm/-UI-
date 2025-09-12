<script setup lang="ts">
import BaseForm from './BaseForm.vue'
import { form, TICKET_STORE } from '../utils'
import { ticketApi } from '@/api/tickets'

const store = inject(TICKET_STORE)!

const submitLoading = ref(false)
const { t } = useI18n()

function handleSubmit() {
  submitLoading.value = true

  const response = ticketApi.create(store.createForm)
  response.then(({ data }) => {
    store.tickets.unshift(data)
    store.visibleCreate = false
  })

  response.finally(() => {
    submitLoading.value = false
  })
}

function handleClose() {
  store.createForm = { ...form.create }
}
</script>

<template>
  <TheModal
    v-model="store.visibleCreate"
    :title="t('ticket.title.create')" class="h-[78%]"
    @close="handleClose"
  >
    <BaseForm v-model="store.createForm" :type-list="store.types" class="px-4" />
    <div class="flex justify-end p-4">
      <XButton
        :loading="submitLoading" :label="t('button.submit')"
        @click="handleSubmit"
      />
    </div>
  </TheModal>
</template>

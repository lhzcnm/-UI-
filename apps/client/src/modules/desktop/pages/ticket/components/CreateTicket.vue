<script setup lang="ts">
import BaseForm from './BaseForm.vue'
import { TICKET_STORE } from '../utils'
import { ticketApi } from '@/api/tickets'

const store = inject(TICKET_STORE)!
const submitLoading = ref(false)

const { t } = useI18n()
const localStore = useLocalStore()

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
</script>

<template>
  <XDialog
    v-model="store.visibleCreate"
    :close-on-esc="false"
    :mask-closable="false"
    :title="localStore.localData['ticket_CreateTicket']"
  >
    <BaseForm v-model="store.createForm" :type-list="store.types" />

    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <ButtonGroup
          :layouts="['cancel', 'submit']"
          @cancel="store.visibleCreate = false" @submit="handleSubmit"
        />
      </div>
    </template>
  </XDialog>
</template>

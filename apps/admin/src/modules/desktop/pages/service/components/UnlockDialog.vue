<script setup lang="ts">
import UnlockForm from '@forms/service/UnlockForm.vue'
import { createUnlock, updateUnlock } from '@/api/services'
import { UNLOCK_STORE } from '../utils'

const store = inject(UNLOCK_STORE)!
const formRef = useTemplateRef('formRef')

async function handleCreate() {
  const data = await createUnlock(store.formBase)
  store.unlocks.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  const body = {
    ...store.formBase,
    id: store.unlocks[store.index!].id,
  }

  await updateUnlock(body)
  store.unlocks[store.index!] = body
  store.visibleBase = false
}
</script>

<template>
  <FormDialog
    v-model="store.visibleBase"
    :index="store.index"
    :update="handleUpdate"
    :create="handleCreate"
    :validate="formRef?.validateForm"
    @close="formRef?.clearErrors"
  >
    <UnlockForm ref="formRef" v-model="store.formBase" />
  </FormDialog>
</template>

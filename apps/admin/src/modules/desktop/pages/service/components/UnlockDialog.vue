<script setup lang="ts">
import UnlockForm from '@/components/forms/service/UnlockForm.vue'
import { createUnlock, updateUnlock } from '@/api/services'
import { UNLOCK_STORE } from '../utils'

const store = inject(UNLOCK_STORE)!
const formRef = useTemplateRef('formRef')

async function handleCreate() {
  if (!formRef.value!.validateForm()) return

  const data = await createUnlock(store.formBase)
  store.unlocks.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  if (!formRef.value!.validateForm()) return

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
    @close="formRef?.clearErrors"
  >
    <UnlockForm ref="formRef" v-model="store.formBase" />
  </FormDialog>
</template>

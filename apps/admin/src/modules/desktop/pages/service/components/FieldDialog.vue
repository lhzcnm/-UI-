<script setup lang="ts">
import FieldForm from './FieldForm.vue'
import { createServiceField, updateServiceField } from '@/api/services'
import { FIELD_STORE } from '../utils'

const store = inject(FIELD_STORE)!
const formRef = useTemplateRef('formRef')

async function handleCreate() {
  await createServiceField(store.formBase)
  store.refresh = !store.refresh
  store.visibleBase = false
}

async function handleUpdate() {
  const body = {
    ...store.formBase,
    id: store.fields.list[store.index!].id,
  }

  await updateServiceField(body)
  store.fields.list[store.index!] = body
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
    <FieldForm ref="formRef" v-model="store.formBase" />
  </FormDialog>
</template>

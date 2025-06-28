<script setup lang="ts">
import GroupForm from '@forms/service/groupForm.vue'
import { createServiceGroup, updateServiceGroup } from '@/api/services'
import { GROUP_STORE } from '../utils'

const store = inject(GROUP_STORE)!
const formRef = useTemplateRef('formRef')
const serviceStore = useServiceStore()

async function handleCreate() {
  const data = await createServiceGroup(store.formBase)
  serviceStore.groups.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  const group = serviceStore.groups[store.index!]
  const body = { ...store.formBase, categoryId: group.categoryId }

  await updateServiceGroup(body)
  serviceStore.groups[store.index!] = body
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
    <GroupForm ref="formRef" v-model="store.formBase" />
  </FormDialog>
</template>

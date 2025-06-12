<script setup lang="ts">
import GroupForm from '@/components/forms/service/groupForm.vue'
import { createServiceGroup, updateServiceGroup } from '@/api/services'
import { GROUP_STORE } from '../utils'

const store = inject(GROUP_STORE)!
const formRef = useTemplateRef('formRef')
const serviceStore = useServiceStore()

async function handleCreate() {
  if (!formRef.value!.validateForm()) return

  const data = await createServiceGroup(store.formBase)
  serviceStore.groups.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  if (!formRef.value!.validateForm()) return

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
    @close="formRef?.clearErrors"
  >
    <GroupForm ref="formRef" v-model="store.formBase" />
  </FormDialog>
</template>

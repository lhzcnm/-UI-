<script setup lang="ts">
import AdminForm from '@/components/forms/users/AdminForm.vue'
import { createAdmin, updateAdmin } from '@/api/admin'
import { ADMIN_STORE } from '../utils'

const store = inject(ADMIN_STORE)!

async function handleCreate() {
  const data = await createAdmin(store.formBase)
  store.admins.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  const admin = store.admins[store.index!]
  const body = { ...store.formBase, userId: admin.userId }
  await updateAdmin(body)

  store.admins[store.index!] = { ...admin, ...body }
  store.visibleBase = false
}
</script>

<template>
  <FormDialog
    v-model="store.visibleBase"
    :index="store.index"
    :update="handleUpdate"
    :create="handleCreate"
  >
    <AdminForm v-model="store.formBase" />
  </FormDialog>
</template>

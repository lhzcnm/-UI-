<script setup lang="ts">
import UnlockFormBase from '@forms/service/UnlockFormBase.vue'
import { createUnlock, updateUnlock } from '@/api/services'
import { UNLOCK_STORE } from '../utils'

const store = inject(UNLOCK_STORE)!

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
  >
    <UnlockFormBase v-model="store.formBase" />
  </FormDialog>
</template>

<script setup lang="ts">
import InterceptFormBase from '@forms/InterceptFormBase.vue'
import { createIntercept, updateIntercept } from '@/api/intercept'
import { INTERCEPT_STORE } from '../utils'

const store = inject(INTERCEPT_STORE)!

async function handleCreate() {
  const data = await createIntercept(store.formBase)
  store.intercepts.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  const intercept = store.intercepts[store.index!]
  const body = { ...store.formBase, id: intercept.id }
  await updateIntercept(body)

  store.intercepts[store.index!] = { ...intercept, ...body }
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
    <InterceptFormBase v-model="store.formBase" />
  </FormDialog>
</template>

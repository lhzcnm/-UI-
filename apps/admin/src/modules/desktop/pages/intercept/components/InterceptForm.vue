<script setup lang="ts">
import InterceptForm from '@/components/forms/InterceptForm.vue'

import { createIntercept, updateIntercept } from '@/api/intercept'
import { validate, VERIFY_MSG, type ValidRule } from '@/utils'

import { INTERCEPT_STORE } from '../utils'
import { IP_REG } from '@3un/utils'

const store = inject(INTERCEPT_STORE)!

function validForm() {
  const ip = store.formBase.ip
  const rules: ValidRule[] = [
    { rule: !!ip, message: VERIFY_MSG.REQ_IP, },
    { rule: IP_REG.test(ip), message: VERIFY_MSG.FMT_IP, },
  ]

  return validate(rules)
}

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
    :validate="validForm"
  >
    <InterceptForm v-model="store.formBase" />
  </FormDialog>
</template>

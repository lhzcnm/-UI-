<script setup lang="ts">
import LevelFormBase from '@/components/forms/users/LevelForm.vue'
import { createLevel, updateLevel } from '@/api/level'
import { LEVEL_STORE } from '../utils'

const store = inject(LEVEL_STORE)!
const levelStore = useLevelStore()
const formRef = useTemplateRef('formRef')

async function handleCreate() {
  if (!formRef.value!.validateForm()) return

  const data = await createLevel(store.formBase)
  levelStore.levels.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  if (!formRef.value!.validateForm()) return

  const level = levelStore.levels[store.index!]
  const body = { ...store.formBase, pricePlanId: level.pricePlanId }
  await updateLevel(body)

  levelStore.levels[store.index!] = body
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
    <LevelFormBase ref="formRef" v-model="store.formBase" />
  </FormDialog>
</template>

<script setup lang="ts">
import LevelFormBase from './LevelForm.vue'

import { createLevel, updateLevel } from '@/api/level'
import { LEVEL_STORE } from '../utils'
import { PLAN_TYPE_ENUM } from '@/utils/enum'
import { validate } from '@/utils/validate'

const store = inject(LEVEL_STORE)!
const levelStore = useLevelStore()
const formRef = useTemplateRef('formRef')

function getRules() {
  const {
    upgradeType,
    thresholdAmount
  } = store.formBase

  const rules = []
  if (upgradeType === PLAN_TYPE_ENUM.GRANDTOTAL) {
    rules.push({
      rule: thresholdAmount > 0,
      message: "累计充值金额必须大于0"
    })
  }

  return rules
}

async function handleCreate() {
  if (!formRef.value!.validateForm()) return
  if (!validate(getRules())) return

  const data = await createLevel({
    ...store.formBase,
    thresholdAmount: store.formBase.upgradeType === PLAN_TYPE_ENUM.GRANDTOTAL
      ? store.formBase.thresholdAmount 
      : 0
  })
  levelStore.levels.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  if (!formRef.value!.validateForm()) return
  if (!validate(getRules())) return

  const level = levelStore.levels[store.index!]
  const body = {
    ...store.formBase,
    pricePlanId: level.pricePlanId,
    thresholdAmount: store.formBase.upgradeType === PLAN_TYPE_ENUM.GRANDTOTAL
      ? store.formBase.thresholdAmount 
      : 0
  }
  await updateLevel(body)

  levelStore.levels[store.index!] = body
  store.visibleBase = false
}
</script>

<template>
  <FormModal
    v-model="store.visibleBase"
    :index="store.index"
    :update="handleUpdate"
    :create="handleCreate"
    @close="formRef?.clearErrors"
  >
    <LevelFormBase
      v-model="store.formBase"
      ref="formRef" class="px-4"
    />
  </FormModal>
</template>

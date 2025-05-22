<script setup lang="ts">
import LevelFormBase from '@forms/level/LevelFormBase.vue'

import type { FormMode } from '@3un/shared'

import { LEVEL_STORE } from '../utils'
import { createLevel, updateLevel } from '@/api/level'

const store = inject(LEVEL_STORE)!
const options = {
  create: {
    title: '新增',
    submitText: '新增',
  },
  update: {
    title: '编辑',
    submitText: '保存',
  },
}

const isCreate = computed(() => store.index === undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const levelStore = useLevelStore()
const loading = ref(false)

function handleSubmit() {
  loading.value = true

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  loading.value = true

  const response = createLevel(store.formBase)

  response.then((data) => {
    levelStore.levels.push(data)
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  loading.value = true

  const level = levelStore.levels[store.index!]
  const body = { ...store.formBase, pricePlanId: level.pricePlanId }
  const response = updateLevel(body)

  response.then(() => {
    levelStore.levels[store.index!] = body
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <XDialog
    v-model="store.visibleBase"
    :title="options[mode].title"
  >
    <LevelFormBase v-model="store.formBase" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDialog>
</template>

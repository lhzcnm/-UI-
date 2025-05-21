<script setup lang="ts">
import UnlockFormBase from './UnlockFormBase.vue'

import type { FormMode } from '@3un/shared'

import { createUnlock, updateUnlock } from '@/api/services'
import { UNLOCK_STORE } from '../utils'

const store = inject(UNLOCK_STORE)!
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

const loading = ref(false)

const isCreate = computed(() => store.index === undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

function handleSubmit() {
  loading.value = true

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  const response = createUnlock(store.formBase)

  response.then((data) => {
    store.unlocks.push(data)
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  const body = {
    ...store.formBase,
    id: store.unlocks[store.index!].id,
  }

  const response = updateUnlock(body)

  response.then(() => {
    store.unlocks[store.index!] = body
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
    <UnlockFormBase v-model="store.formBase" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDialog>
</template>

<script setup lang="ts">
import UserFormBase from './UserFormBase.vue'

import type { FormMode } from '@3un/shared'

import { USER_STORE } from '../utils'
import { createUser, updateUser } from '@/api/users'

const store = inject(USER_STORE)!
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

const loading = ref(false)

function handleSubmit() {
  loading.value = true

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  loading.value = true

  const response = createUser(store.formBase)
  response.then(() => {
    store.refresh = !store.refresh
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  loading.value = true

  const user = store.users.list[store.index!]
  const body = { ...store.formBase, userId: user.userId }
  const response = updateUser(body)

  response.then(() => {
    store.refresh = !store.refresh
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <XDrawer
    v-model="store.visibleBase"
    width="500px" :title="options[mode].title"
  >
    <UserFormBase v-model="store.formBase" />
    <template #footer>
      <div class="flex justify-end space-x-2 p-4 border-t">
        <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDrawer>
</template>

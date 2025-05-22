<script setup lang="ts">
import GroupFormBase from '@forms/service/groupFormBase.vue'

import type { FormMode } from '@3un/shared'

import { createServiceGroup, updateServiceGroup } from '@/api/services'
import { GROUP_STORE } from '../utils'

const store = inject(GROUP_STORE)!
const options = {
  create: {
    title: '新增服务组',
    submitText: '新增',
  },
  update: {
    title: '编辑服务组',
    submitText: '保存',
  },
}

const isCreate = computed(() => store.index === undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const serviceStore = useServiceStore()
const loading = ref(false)

function handleSubmit() {
  loading.value = true

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  const response = createServiceGroup(store.formBase)

  response.then((data) => {
    serviceStore.groups.push(data)
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  const group = serviceStore.groups[store.index!]
  const body = { ...store.formBase, categoryId: group.categoryId }

  const response = updateServiceGroup(body)

  response.then(() => {
    serviceStore.groups[store.index!] = body
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
    <GroupFormBase v-model="store.formBase" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDialog>
</template>

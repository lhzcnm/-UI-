<script setup lang="ts">
import GroupFormBase from './groupFormBase.vue'
import { GROUP_STORE } from '../utils'

import type { FormMode } from '@3un/shared'

import { createServiceGroup, deleteServiceGroup, updateServiceGroup } from '@/api/services'
import { zServiceGroup } from '@/inters/services'

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

const isCreate = computed(() => store.form.categoryId === 0)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const serviceStore = useServiceStore()
const loading = ref(false)

function handleSubmit() {
  loading.value = true

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  const response = createServiceGroup(store.form)

  response.then((data) => {
    const item = zServiceGroup.parse(data)
    serviceStore.groups.push(item)
    store.visible = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  const response = updateServiceGroup(store.form)

  response.then(() => {
    const id = store.form.categoryId
    const idx = serviceStore.groups
      .findIndex(item => item.categoryId === id)

    serviceStore.groups[idx] = store.form
    store.visible = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleDelete() {
  if (!window.confirm('确定要删除该服务吗？')) return

  const id = store.form.categoryId
  deleteServiceGroup(id).then(() => {
    const idx = serviceStore.groups
      .findIndex(item => item.categoryId === id)

    serviceStore.groups.splice(idx, 1)
    store.visible = false
  })
}
</script>

<template>
  <XDialog
    v-model="store.visible"
    :title="options[mode].title"
  >
    <GroupFormBase v-model="store.form" />
    <template #footer>
      <div class="flex justify-between pt-4">
        <XButton
          v-show="!isCreate"
          color="danger"
          icon="lucide:trash-2"
          @click="handleDelete"
        >
          删除服务
        </XButton>
        <div class="ml-auto space-x-2">
          <XButton variant="soft" @click="store.visible = false">取消</XButton>
          <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
        </div>
      </div>
    </template>
  </XDialog>
</template>

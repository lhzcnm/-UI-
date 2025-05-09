<script setup lang="ts">
import ItemFormBase from './ItemFormBase.vue'
import { SERVICE_STORE } from '../utils'

import type { FormMode } from '@3un/shared'

import { createService, deleteService, updateService } from '@/api/services'
import { zService } from '@/inters/services'

const store = inject(SERVICE_STORE)!
const options = {
  create: {
    title: '新增服务',
    submitText: '新增',
  },
  update: {
    title: '编辑服务',
    submitText: '保存',
  },
}

const isCreate = computed(() => store.form.packageId === 0)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const serviceStore = useServiceStore()
const loading = ref(false)

function handleSubmit() {
  loading.value = true

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  const response = createService(store.form)

  response.then((data) => {
    const item = zService.parse(data)
    serviceStore.items.push(item)
    store.visible = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  const response = updateService(store.form)

  response.then(() => {
    const id = store.form.packageId
    const idx = serviceStore.items
      .findIndex(item => item.packageId === id)

    serviceStore.items[idx] = store.form
    store.visible = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleDelete() {
  if (!window.confirm('确定要删除该服务吗？')) return

  const id = store.form.packageId
  deleteService(id).then(() => {
    const idx = serviceStore.items
      .findIndex(item => item.packageId === id)

    serviceStore.items.splice(idx, 1)
    store.visible = false
  })
}
</script>

<template>
  <XDrawer
    v-model="store.visible"
    width="500px" :title="options[mode].title"
  >
    <ItemFormBase v-model="store.form" />
    <template #footer>
      <div class="flex justify-between p-4 border-t">
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
  </XDrawer>
</template>

<script setup lang="ts">
import ItemForm from '@/components/forms/service/ItemForm.vue'
import { createService, deleteService, updateService } from '@/api/services'

import type { FormMode } from '@3un/shared'
import { xconfirm } from '@3un/utils'

import { SERVICE_STORE } from '../utils'

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

const store = inject(SERVICE_STORE)!
const serviceStore = useServiceStore()

const isCreate = computed(() => store.index === undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const loading = ref(false)

function handleSubmit() {
  loading.value = true

  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  const response = createService(store.formBase)

  response.then((data) => {
    serviceStore.items.push(data)
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  const item = serviceStore.items[store.index!]
  const body = { ...store.formBase, packageId: item.packageId }

  const response = updateService(body)

  response.then(() => {
    serviceStore.items[store.index!] = body
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

async function handleDelete() {
  if (!await xconfirm('确定要删除该服务吗？')) return

  const item = serviceStore.items[store.index!]
  deleteService(item.packageId).then(() => {
    serviceStore.items.splice(store.index!, 1)
    store.visibleBase = false
  })
}
</script>

<template>
  <XDrawer
    v-model="store.visibleBase"
    width="500px" :title="options[mode].title"
  >
    <ItemForm v-model="store.formBase" />
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
          <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
          <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
        </div>
      </div>
    </template>
  </XDrawer>
</template>

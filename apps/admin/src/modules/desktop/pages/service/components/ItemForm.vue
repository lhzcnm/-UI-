<script setup lang="ts">
import ItemFormBase from './ItemFormBase.vue'

import { createService, updateService } from '@/api/services'
import { SERVICE_STORE } from '../utils'
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

const isCreate = computed(() => !store.index)
const mode = computed(() => isCreate.value ? 'create' : 'update')

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
    store.visable = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  const current = serviceStore.items[store.index!]
  const response = updateService({
    packageId: current.packageId,
    ...store.form,
  })

  response.then(() => {
    Object.assign(
      serviceStore.items[store.index!],
      { ...current, ...store.form }
    )

    store.visable = false
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <XDrawer
    v-model="store.visable"
    width="500px" :title="options[mode].title"
  >
    <ItemFormBase v-model="store.form" />
    <template #footer>
      <div class="flex justify-end space-x-2 p-4 border-t">
        <XButton variant="soft" @click="store.visable = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDrawer>
</template>

<script setup lang="ts">
import { createTicketType, getTicketTypes } from '@/api/ticket'

import { TICKET_STORE } from '../utils'
import { column } from '../utils/typeColumn'

const store = inject(TICKET_STORE)!

const loading = ref(false)
const type = ref('')

watch(
  () => store.visibleType,
  (val) => {
    if (!val) return type.value = ''
    loading.value = true

    const response = getTicketTypes()
    response.then((data) => store.types = data)
    response.finally(() => loading.value = false)
  },
)

async function createType() {
  const response = createTicketType({
    departmentName: type.value,
    departmentDes: type.value,
    deptOrder: 1,
    status: 0,
  })

  response.then(data => {
    store.types.push(data)
    type.value = ''
  })
}
</script>

<template>
  <XDialog
    v-model="store.visibleType"
    ui-root="sm:max-w-lg"
    title="常见问题"
  >
    <div class="flex space-x-2 mb-2">
      <XInput v-model="type" placeholder="请输入常见问题" clearable />
      <XButton label="增加" @click="createType" />
    </div>

    <XTable
      :data="store.types"
      :columns="column"
      :loading="loading"
    />

    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleType = false">取消</XButton>
        <XButton>保存</XButton>
      </div>
    </template>
  </XDialog>
</template>

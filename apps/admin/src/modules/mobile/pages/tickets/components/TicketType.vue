<script setup lang="ts">
import { toast } from 'vue-sonner'

import { createTicketType, deleteTicketType, getTicketTypes } from '@/api/ticket'
import { TICKET_STORE } from '../utils'
import type { TicketType } from '@/inters/ticket'

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
  if (!type.value) {
    return toast.warning('常见问题不能为空')
  }

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

function handleDelete(item: TicketType, index: number) {
  deleteTicketType(item.departmentId).then(() => {
    store.types.splice(index, 1)
  })
}
</script>

<template>
  <TheModal
    v-model="store.visibleType"
    title="常见问题"
  >
    <div class="flex space-x-2 px-4 mb-3">
      <XInput v-model="type" placeholder="请输入常见问题" clearable />
      <XButton label="增加" @click="createType" />
    </div>

    <div class="flex flex-col space-y-3 px-4">
      <div
        v-for="(item, index) in store.types" :key="item.departmentId"
        class="border rounded-md"
      >
        <h3 class="p-3">
          {{ item.departmentId }} - {{ item.departmentName }}
        </h3>

        <div class="flex justify-between bg-muted border-t border-dashed px-3 py-2">
          <XSwitch
            v-model="item.status"
            label="启用"
            :activeValue="0"
            :inactiveValue="1"
          />
          <XButton
            label="删除"
            size="sm"
            color="danger"
            icon="lucide:trash-2"
            @click="handleDelete(item, index)"
          />
        </div>
      </div>
    </div>
  </TheModal>
</template>

<script setup lang="ts">
import MonitorServerForm from './MonitorServerForm.vue'

import { toast } from 'vue-sonner'

import { MONITOR_SERVER_STORE } from '../utils'
import { updateMonitorServer } from '@/api/monitor'

const store = inject(MONITOR_SERVER_STORE)!

async function handleSubmit() {
  try {
    await updateMonitorServer({
      ...store.formBase,
      domainId: store.domainId!,
      serverId: store.serverId!,
    })

    toast.success("更新成功")
    store.visibleBase = false
  } catch {}
}
</script>

<template>
  <TheModal
    v-model="store.visibleBase"
    title="编辑"
    header-class="border-b"
  >
    <div class="flex flex-col space-y-4 p-4">
      <MonitorServerForm v-model="store.formBase" />

      <div class="flex justify-end space-x-2">
        <XButton label="取消"
          variant="soft" @click="store.visibleBase = false" />
        <XButton label="保存"
          @click="handleSubmit" />
      </div>
    </div>
  </TheModal>
</template>

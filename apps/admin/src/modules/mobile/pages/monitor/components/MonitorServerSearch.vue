<script setup lang="ts">
import MonitorServerSearchForm from './MonitorServerSearchForm.vue'

import { IP_REG, useCopyFn } from '@3un/utils'

import { MONITOR_SERVER_STORE } from '../utils'
import { toast } from 'vue-sonner'

const store = inject(MONITOR_SERVER_STORE)!

const cloned = useCopyFn(() => store.formSearch)
const copied = ref(cloned())

watch(
  () => store.visibleSearch,
  (val) => val && (copied.value = cloned()),
)

function handleCancel() {
  copied.value = cloned()
  store.visibleSearch = false
}

function handleSubmit() {
  const { serverIp } = copied.value
  if (serverIp && IP_REG.test(serverIp)) {
    return toast.warning("请输入正确的ipv4地址")
  }
  
  store.formSearch = copied.value
  store.visibleSearch = false
  store.refresh = !store.refresh
  store.page = 1
}
</script>

<template>
  <TheModal v-model="store.visibleSearch"
    title="筛选"
    header-class="border-b"
    @close="handleCancel"
  >
    <template #default>
      <div class="flex flex-col p-4 space-y-4">
        <MonitorServerSearchForm v-model="copied" />

        <div class="flex justify-end space-x-2">
          <XButton variant="soft"
            label="取消" @click="handleCancel" />
          <XButton label="确定" @click="handleSubmit" />
        </div>
      </div>
    </template>
  </TheModal>
</template>

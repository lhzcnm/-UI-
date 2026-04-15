<script setup lang="ts">
import OrderCleanForm from './OrderCleanForm.vue'
import { cleanOrder } from '@/api/orders'

import { toast } from 'vue-sonner'
import dayjs from 'dayjs'
import { useCopyFn } from '@3un/utils'

import { ORDER_STORE } from '../utils'
import { updateSetting } from '@/api/settings'
import type { AutoCleanSettings } from '@/inters/settings'

const store = inject(ORDER_STORE)!
const iStore = useSystemStore()

const loading = ref(false)

const cloned = useCopyFn(() => ({
  autoCleanEnable: iStore.settings["AutoCleanEnable"] ?? false,
  retainDays: iStore.settings["OrderRetainDays"] ?? 30,
}))
const autoCleanForm = ref<AutoCleanSettings>(cloned())

watch(
  () => store.visibleClear,
  (val) => {
    if (val) {
      autoCleanForm.value = cloned()

      if (autoCleanForm.value.autoCleanEnable) {
        store.formClean.checked = 'auto'
      }
    }
  }
)

async function handleSubmit() {
  try {
    let date = store.formClean.time
    loading.value = true
  
    if (store.formClean.checked !== 'custom' && store.formClean.checked !== 'auto') {
      date = dayjs()
        .subtract(+store.formClean.checked, 'day')
        .format('YYYY-MM-DD')
    } else if (store.formClean.checked === 'auto') {
      await handleAutoCleanSubmit()
      return
    } else if (!date) {
      toast.warning('请选择日期')
    }

    await cleanOrder(date)
  
    store.visibleClear = false
    store.refresh = !store.refresh
    store.page = 1
  } finally {
    loading.value = false
  }
}

async function handleAutoCleanSubmit() {
  const { autoCleanEnable, retainDays } = autoCleanForm.value

  if (autoCleanEnable && !retainDays) {
    return toast.warning("请输入订单保留日期")
  }

  if (autoCleanEnable && retainDays < 30) {
    return toast.warning("历史订单至少需要保留30天")
  }
  if (autoCleanEnable && retainDays > 180) {
    return toast.warning("历史订单至多保留180天")
  }

  await updateSetting([
    { name: 'AutoCleanEnable', status: autoCleanEnable },
    { name: 'OrderRetainDays', content: retainDays.toString() },
  ])

  await iStore.getSetting()
  store.visibleClear = false
  store.refresh = !store.refresh
  store.page = 1
}
</script>

<template>
  <TheModal
    v-model="store.visibleClear"
    title="清理订单"
    class="h-[60%]"
  >
    <OrderCleanForm v-model="store.formClean" v-model:auto="autoCleanForm" class="px-4" />

    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" label="取消" @click="store.visibleClear = false" />
      <XButton color="danger" label="清理" :loading="loading" @click="handleSubmit" />
    </div>
  </TheModal>
</template>

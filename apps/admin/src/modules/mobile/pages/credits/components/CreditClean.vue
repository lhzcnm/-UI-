<script setup lang="ts">
import CreditCleanForm from './CreditCleanForm.vue'
import { cleanCredit } from '@/api/credits'

import { toast } from 'vue-sonner'
import dayjs from 'dayjs'
import { useCopyFn } from '@3un/utils'

import { CREDIT_STORE } from '../utils'
import { updateSetting } from '@/api/settings'
import type { AutoCleanSettings } from '@/inters/settings'

const store = inject(CREDIT_STORE)!
const iStore = useSystemStore()

const loading = ref(false)

const cloned = useCopyFn(() => ({
  autoCleanEnable: iStore.settings["AutoCleanCreditsEnable"] ?? false,
  retainDays: iStore.settings["creditsRetainDays"] ?? 30,
}))
const autoCleanForm = ref<AutoCleanSettings>(cloned())

watch(
  () => store.visibleClean,
  (val) => {
    if (val) {
      autoCleanForm.value = cloned()
      console.log(autoCleanForm)

      if (autoCleanForm.value.autoCleanEnable) {
        store.formClean.checked = 'auto'
      }
    }
  }
)

async function handleSubmit() {
  let date = store.formClean.time

  if (store.formClean.checked !== 'auto') {
    date = dayjs()
      .subtract(+store.formClean.checked, 'day')
      .format('YYYY-MM-DD')
  } else if (store.formClean.checked === 'auto') {
    await handleAutoCleanSubmit()
    return
  } else if (!date) {
    toast.warning('请选择日期')
    return
  }

  loading.value = true
  const resp = cleanCredit(date)

  resp.then(() => {
    store.visibleClean = false
    store.refresh = !store.refresh
    store.page = 1
  })

  resp.finally(() => {
    loading.value = false
  })
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
    { name: 'AutoCleanCreditsEnable', status: autoCleanEnable },
    { name: 'creditsRetainDays', content: retainDays.toString() },
  ])

  await iStore.getSetting()
  store.visibleClean = false
  store.refresh = !store.refresh
  store.page = 1
}
</script>

<template>
  <TheModal
    v-model="store.visibleClean"
    title="清理记录"
  >
    <CreditCleanForm v-model="store.formClean" v-model:auto="autoCleanForm" class="px-4" />
    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" label="取消" @click="store.visibleClean = false" />
      <XButton color="danger" label="清理" :loading="loading" @click="handleSubmit" />
    </div>
  </TheModal>
</template>

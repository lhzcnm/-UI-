<script setup lang="ts">
import CreditCleanForm from './CreditCleanForm.vue'
import { cleanCredit } from '@/api/credits'

import { toast } from 'vue-sonner'
import dayjs from 'dayjs'

import { CREDIT_STORE } from '../utils'

const store = inject(CREDIT_STORE)!

const loading = ref(false)

function handleSubmit() {
  let date = store.formClean.time

  if (store.formClean.checked !== 'auto') {
    date = dayjs()
      .subtract(+store.formClean.checked, 'day')
      .format('YYYY-MM-DD')
  }
  else if (!date) {
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
</script>

<template>
  <XDialog v-model="store.visibleClean" ui-root="sm:max-w-md" title="清理记录">
    <CreditCleanForm v-model="store.formClean" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-6">
        <XButton variant="soft" label="取消" @click="store.visibleClean = false" />
        <XButton color="danger" label="清理" :loading="loading" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

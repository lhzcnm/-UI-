<script setup lang="ts">
import OrderCleanForm from './OrderCleanForm.vue'
import { cleanOrder } from '@/api/orders'

import { toast } from 'vue-sonner'
import dayjs from 'dayjs'

import { ORDER_STORE } from '../utils'

const store = inject(ORDER_STORE)!

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
  const resp = cleanOrder(date)

  resp.then(() => {
    store.visibleClear = false
    store.refresh = !store.refresh
    store.page = 1
  })

  resp.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <XDialog v-model="store.visibleClear" ui-root="sm:max-w-md" title="清理订单">
    <OrderCleanForm v-model="store.formClean" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-6">
        <XButton variant="soft" label="取消" @click="store.visibleClear = false" />
        <XButton color="danger" label="清理" :loading="loading" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

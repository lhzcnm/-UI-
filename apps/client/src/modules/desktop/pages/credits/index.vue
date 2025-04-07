<script setup lang="ts">
import { userApi } from '@/api/user'
import type { CreditLogsResponse } from '@/api/user'
import { columns } from './utils/columns'

const page = ref(1)
const pageSize = ref(20)

const loading = ref(false)
const creditLogs = ref<CreditLogsResponse>()

watch(
  [page, pageSize],
  async ([pageVal, pageSizeVal]) => {
    loading.value = true
    const response = await userApi.creditLogs({
      pageSize: pageSizeVal,
      page: pageVal
    })
    creditLogs.value = response.data
    loading.value = false
  },
  { immediate: true }
)
</script>

<template>
  <div class="p-4 h-full">
    <section class="space-x-2 mb-3">
      <XPagination
        v-model="page"
        v-model:size="pageSize"
        :total="creditLogs?.total ?? 0"
        :layouts="['total', 'sizes', 'prev', 'pager', 'next', 'jumper']"
      />
    </section>

    <XTable
      v-if="creditLogs && !loading"
      :data="creditLogs.list"
      :columns="columns"
      row-key="historyId"
      class="h-[calc(100%-3rem)]"
    />
  </div>
</template>
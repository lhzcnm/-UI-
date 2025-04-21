<script setup lang="ts">
import CreditLogCard from './components/CreditLogCard.vue'
import { twJoin } from 'tailwind-merge'

import type { CreditLogsResponse } from '@/api/user'
import { userApi } from '@/api/user'

const serviceStore = useServiceStore()
await serviceStore.getServices()

const page = ref(1)
const limit = ref(20)
const loading = ref(false)

const IPage = { list: [], total: 0, page: 1, pageSize: 20 }
const logs = ref<CreditLogsResponse>(IPage)

watch(
  page,
  async (value) => {
    loading.value = true
    const { data } = await userApi.creditLogs({
      pageSize: limit.value,
      page: value,
    })

    logs.value = data
    loading.value = false
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full">
    <BackHeader title="积分变更记录" />

    <Fallback v-if="loading" />
    <template v-else>
      <div
        :class="twJoin(
          'flex items-center justify-between',
          'm-3 p-3 rounded-lg bg-card shadow-sm'
        )"
      >
        <XSimplePagination
          v-model="page"
          :page-size="limit"
          :total="logs.total"
        />
        <span class="text-sm text-muted-foreground">
          总共 {{ logs.total }} 条记录
        </span>
      </div>

      <div 
        :class="twJoin(
          'px-3 pb-6 space-y-3 overflow-y-auto',
          'h-[calc(100%-var(--mobile-header-h)-5.5rem)]'
        )"
      >
        <CreditLogCard
          v-for="item in logs.list"
          :key="item.historyId"
          :item="item"
        />
      </div>
    </template>
  </div>
</template>

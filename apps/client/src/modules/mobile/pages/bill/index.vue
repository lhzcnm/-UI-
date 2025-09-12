<script setup lang="ts">
import type { InvoicesResponse } from '@/api/user'
import { userApi } from '@/api/user'
import { twJoin } from 'tailwind-merge'

const page = ref(1)
const limit = ref(20)

const IPage = { list: [], total: 0, page: 1, pageSize: 20 }
const bills = ref<InvoicesResponse>(IPage)

const { t } = useI18n()

watch(
  page,
  async (value) => {
    const { data } = await userApi.invoices({
      pageSize: limit.value,
      page: value,
    })

    bills.value = data
  },
  { immediate: true },
)
</script>

<template>
  <div class="h-full">
    <BackHeader :title="t('recharge.history.title')" />

    <div
      :class="twJoin(
        'flex items-center justify-between',
        'm-3 p-3 rounded-lg bg-card shadow-sm'
      )"
    >
      <XSimplePagination
        v-model="page"
        :page-size="limit"
        :total="bills.total"
      />
      <span class="text-sm text-muted-foreground">
        {{ t('recharge.history.total', { count: bills.total }) }}
      </span>
    </div>

    <div 
      :class="twJoin(
        'px-3 pb-6 space-y-3 overflow-y-auto',
        'h-[calc(100%-var(--mobile-header-h)-5.5rem)]'
      )"
    >
      <BillCard
        v-for="item in bills.list"
        :key="item.paymentId"
        :item="item"
      />
    </div>
  </div>
</template>

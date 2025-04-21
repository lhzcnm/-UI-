<script setup lang="ts">
import type { InvoicesResponse } from '@/api/user'
import { RECHARGE_STORE } from '../utils'
import { downloadURL } from '@3un/utils'
import { userApi } from '@/api/user'

const page = ref(1)
const loading = ref(false)

const IPage = { list: [], total: 0, page: 1, pageSize: 20 }
const bills = ref<InvoicesResponse>(IPage)
const store = inject(RECHARGE_STORE)!

watch(() => store.isComplete, () => getList())
watch(page, getList, { immediate: true })

async function getList(page = 1) {
  const { data } = await userApi.invoices({
    pageSize: 20,
    page,
  })

  bills.value = data
}

function handleExport() {
  loading.value = true

  const response = userApi.exportInvoices()
  response.then(({ data }) => downloadURL(data))
  response.finally(() => loading.value = false)
}
</script>

<template>
  <section class="flex-1 min-w-max bg-card border rounded-md">
    <div class="flex items-center justify-between p-4">
      <XButton
        icon="lucide:arrow-down-to-line" label="导出记录" color="teal"
        :loading="loading" @click="handleExport"
      />
      <XPagination
        v-model="page"
        hide-on-single-page
        :size="20" :total="bills.total"
      />
    </div>

    <div class="h-[calc(100%-5.25rem)] overflow-y-auto px-4">
      <NoMessage v-if="bills.total === 0" title="暂无记录" />
      <div v-else class="grid gap-3 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        <BillCard
          v-for="item in bills.list"
          :key="item.paymentId"
          :item="item"
        />
      </div>
    </div>
  </section>
</template>

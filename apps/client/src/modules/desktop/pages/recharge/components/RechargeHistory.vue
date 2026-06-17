<script setup lang="ts">
import { RECHARGE_STORE } from '../utils'
import { downloadURL } from '@3un/utils'
import { userApi } from '@/api/user'

const page = ref(1)
const loading = ref(false)

const store = inject(RECHARGE_STORE)!

const localStore = useLocalStore()

watch(() => store.isComplete, () => getList())
watch(
  (
    [
      () => page.value,
      () => store.refresh,
    ]
  ),
  () => {
    getList(page.value)
  },
  {
    immediate: true,
  }
)

async function getList(page = 1) {
  const { data } = await userApi.invoices({
    pageSize: 20,
    page,
  })

  store.bills = data
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
        icon="lucide:arrow-down-to-line" :label="localStore.localData['recharge_ExportRecords']" color="success"
        :loading="loading" @click="handleExport"
      />
      <XPagination
        v-model="page"
        hide-on-single-page
        :limit="20" :total="store.bills.total"
      />
    </div>

    <div class="h-[calc(100%-5.25rem)] overflow-y-auto px-4">
      <NoMessage v-if="store.bills.total === 0" :title="localStore.localData['recharge_NoRecords']" />
      <div v-else class="grid gap-3 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
        <BillCard
          v-for="item in store.bills.list"
          :key="item.paymentId"
          :item="item"
        />
      </div>
    </div>
  </section>
</template>

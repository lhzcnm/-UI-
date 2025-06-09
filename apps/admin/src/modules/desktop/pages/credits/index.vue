<script setup lang="ts">
import CreditSearch from './components/CreditSearch.vue'

import type { CreditListParams } from '@/inters/credits'
import { zCreditSearchForm } from '@/inters/credits'
import { getCreditList } from '@/api/credits'

import type { CreditStore } from './utils'
import { CREDIT_STORE, columns } from './utils'

const store: CreditStore = reactive({
  credits: { list: [], total: 0, page: 1, pageSize: 20 },
  formSearch: zCreditSearchForm.parse({}),
  visibleSearch: false,
  refresh: false,
  page: 1,
  limit: 20,
})

provide(CREDIT_STORE, store)

const route = useRoute()
const router = useRouter()

const loading = ref(false)

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([pageValue, limitValue]) => {
    const imeiNo = store.formSearch.imeiNo

    getList({
      page: pageValue,
      pageSize: limitValue,
      ...store.formSearch,
      imeiNo: imeiNo
        ? imeiNo
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
        : undefined,
    })
  },
)

watch(
  () => route.query,
  ({ uid, sid }) => {
    store.formSearch = {
      ...store.formSearch,
      userId: uid ? Number(uid) : undefined,
      serviceId: sid ? Number(sid) : undefined,
    }

    store.refresh = !store.refresh
    store.page = 1
  },
  { immediate: true },
)

function getList(params: CreditListParams) {
  loading.value = true

  const response = getCreditList(params)
  response.then(data => store.credits = data)
  response.finally(() => loading.value = false)
}

function resetSearch() {
  store.formSearch = zCreditSearchForm.parse({})
  router.replace({ path: route.path })
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex items-center">
        <XButton
          label="筛选"
          class="mr-2"
          icon="lucide:filter"
          @click="store.visibleSearch = true"
        />
        <XButton
          label="清空筛选"
          variant="outline"
          icon="lucide:brush-cleaning"
          @click="resetSearch"
        />
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="store.credits.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
          'jumper',
        ]"
      />
    </section>

    <div class="p-3">
      <XTable
        :columns="columns"
        :loading="loading"
        :data="store.credits.list"
        row-key="id"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <CreditSearch />
  </div>
</template>

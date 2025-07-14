<script setup lang="ts">
import CreditSearch from './components/CreditSearch.vue'
import CreditClean from './components/CreditClean.vue'
import CreditCard from './components/CreditCard.vue'

import { hash } from 'ohash'

import type { CreditListParams } from '@/inters/credits'
import { zCreditSearchForm } from '@/inters/credits'
import { getCreditList } from '@/api/credits'
import { createList } from '@/utils'

import type { CreditStore } from './utils'
import { CREDIT_STORE } from './utils'

const store: CreditStore = reactive({
  credits: createList(),

  formSearch: zCreditSearchForm.parse({}),
  formClean: { checked: '90', time: '' },

  visibleSearch: false,
  visibleClean: false,

  refresh: false,
  page   : 1,
  limit  : 20,
})

provide(CREDIT_STORE, store)

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const queryHash = computed(() => hash(route.query))

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
      ...zCreditSearchForm.parse({}),
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

function handleCleanOrder() {
  store.formClean = { checked: '90', time: '' }
  store.visibleClean = true
}

function resetSearch() {
  router.replace({
    force: true,
    path: route.path
  })
}
</script>

<template>
  <div>
    <Toolbar :loading="loading">
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="store.credits.total"
      />

      <template #extra>
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

          <hr class="h-6 w-px mx-4 bg-border" />

          <XButton
            label="清理记录"
            color="danger"
            variant="outline"
            icon="lucide:trash-2"
            @click="handleCleanOrder"
          />
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="!loading && store.credits.list.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <CreditCard
          v-for="credit in store.credits.list"
          :key="credit.historyId" :item="credit"
        />
      </template>
    </section>

    <CreditSearch :key="queryHash" />
    <CreditClean />
  </div>
</template>

<script setup lang="ts">
import RechargeSearch from './components/RechargeSearch.vue'
import RechargeModal from './components/RechargeModal.vue'
import RechargeCard from './components/RechargeCard.vue'

import dayjs from 'dayjs'
import { hash } from 'ohash'

import type { RechargeListParams, RechargeUpdateParams } from '@/inters/recharge'
import { zRechargeSearchForm } from '@/inters/recharge'
import { getRecharges } from '@/api/recharge'
import { createList } from '@/utils'

import type { RechargeStore } from './utils'
import { RECHARGE_STORE } from './utils'

const store: RechargeStore = reactive({
  recharges: createList(),

  formSearch: zRechargeSearchForm.parse({}),
  formUpdate: {} as RechargeUpdateParams,

  visibleSearch: false,
  visibleUpdate: false,

  refresh: false,
  index  : undefined,
  page   : 1,
  limit  : 20,
})

provide(RECHARGE_STORE, store)

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const queryHash = computed(() => hash(route.query))
const packageStore = usePackageStore()
await packageStore.getList()

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([pageValue, limitValue]) => {
    getList({
      page: pageValue,
      pageSize: limitValue,
      ...store.formSearch,
    })
  },
)

watch(
  () => route.query,
  ({ uid, q }) => {
    store.formSearch = {
      ...zRechargeSearchForm.parse({}),
      userId: uid ? Number(uid) : undefined,
      byAdmin: q === 'admin',
    }

    if (q === 'today') {
      const format = 'YYYY-MM-DD HH:mm:ss'
      store.formSearch.startTime = dayjs().startOf('day').format(format)
      store.formSearch.endTime = dayjs().endOf('day').format(format)
    }

    store.refresh = !store.refresh
    store.page = 1
  },
  { immediate: true },
)

function getList(params: RechargeListParams) {
  loading.value = true

  const response = getRecharges(params)
  response.then((data) => store.recharges = data)
  response.finally(() => loading.value = false)
}

function resetSearch() {
  router.replace({
    force: true,
    path: route.path,
    query: { q: route.query.q },
  })
}
</script>

<template>
  <div>
    <Toolbar :loading="loading">
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="store.recharges.total"
      />

      <template #extra>
        <XButton
          label="筛选"
          class="mr-2"
          icon="lucide:filter"
          @click="store.visibleSearch = true"
        />
        <XButton
          label="清空筛选"
          variant="outline"
          icon="lucide:x"
          @click="resetSearch"
        />
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="!loading && store.recharges.list.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <RechargeCard
          v-for="(item, index) in store.recharges.list"
          :key="item.paymentId" :item="item" :index="index"
        />
      </template>
    </section>

    <RechargeSearch :key="queryHash" />
    <RechargeModal />
  </div>
</template>

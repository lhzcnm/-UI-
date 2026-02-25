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
import type { ConfigItem } from '@/inters/settings'
import { getConfigs, updateConfig } from '@/api/settings'

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

const feeDialog = ref(false)
const threshold = ref(0)
const fee = ref(0)

const getConfigsData = ref<ConfigItem[]>([])

async function handFeeUpdate() {
  const res = getConfigsData.value.map(item => {
    if (item.id == 8) {
      item.value = `${fee.value / 100}`
    }
    if (item.id == 9) {
      item.value = `${threshold.value}`
    }
    return item
  })
  updateConfig(res)

  feeDialog.value = false
}

async function getFee() {
  const res = await getConfigs()

  getConfigsData.value = res

  getConfigsData.value.map(item => {
    if (item.id == 8) {
      fee.value = +item.value * 100
    }
    if (item.id == 9) {
      threshold.value = +item.value
    }
    return item
  })
}

getFee()
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
          class="mr-2"
          icon="lucide:x"
          @click="resetSearch"
        />

        <XButton color="success"  variant="outline" label="手续费设置" icon="iconoir:settings" @click="feeDialog = true" />
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

    <XDialog v-model="feeDialog" title="手续费设置">
      <div class="space-y-3 text-sm">
        <!-- 手续费界限 -->
        <div class="flex justify-between items-center">
          <div class="mb-1 text-muted-foreground">手续费界限:</div>
          <input v-model="threshold" type="number" placeholder="请输入界限金额" class="w-2/3 rounded-lg border border-gray-300 px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <!-- 手续费率 -->
        <div class="flex justify-between items-center">
          <div class="mb-1 text-muted-foreground">手续费率 (%):</div>
          <input v-model="fee" type="number" placeholder="请输入手续费率" class="w-2/3 rounded-lg border border-gray-300 px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <div class="w-full flex justify-end space-x-2">
          <XButton @click="feeDialog = false" label="取消" variant="outline" color="primary" />
          <XButton @click="handFeeUpdate" label="修改" color="primary" />
        </div>
      </div>
    </XDialog>
  </div>
</template>

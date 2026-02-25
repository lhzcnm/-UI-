<script setup lang="ts">
import RechargeSearch from './components/RechargeSearch.vue'
import RechargeDialog from './components/RechargeDialog.vue'

import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'
import dayjs from 'dayjs'
import { hash } from 'ohash'

import type { RechargeListParams, RechargeUpdateParams } from '@/inters/recharge'
import { deleteRecharges, getRecharges } from '@/api/recharge'
import { zRechargeSearchForm } from '@/inters/recharge'
import { createList } from '@/utils'

import type { RechargeStore } from './utils'
import { columns } from './utils/column'
import { RECHARGE_STORE } from './utils'
import type { XTableExpose } from '@3un/ui'
import { getConfigs, updateConfig } from '@/api/settings'
import type { ConfigItem } from '@/inters/settings'

const store: RechargeStore = reactive({
  recharges: createList(),

  formSearch: zRechargeSearchForm.parse({}),
  formUpdate: {} as RechargeUpdateParams,

  visibleSearch: false,
  visibleUpdate: false,

  refresh: false,
  index: undefined,
  page: 1,
  limit: 20,
})

provide(RECHARGE_STORE, store)

const route = useRoute()
const router = useRouter()

const ids = ref<number[]>([])
const loading = ref(false)
const tableRef = ref<XTableExpose | null>(null)

const queryHash = computed(() => hash(route.query))
const packageStore = usePackageStore()
await packageStore.getList()

const isAdmin = computed(() => {
  return route.query.q === 'admin'
})

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
      byAdmin: (!isAdmin.value && store.formSearch.paymentMethod === 5) ? true : store.formSearch.byAdmin
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

  tableRef.value?.scrollToTop()
}

function resetSearch() {
  router.replace({
    force: true,
    path: route.path,
    query: { q: route.query.q },
  })
}

async function handleDelete() {
  if (ids.value.length === 0) {
    return toast.warning('请选择要删除的充值记录')
  }

  if (!await xconfirm('确定要删除这些充值记录吗？')) return

  deleteRecharges(ids.value).then(() => {
    store.refresh = !store.refresh
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
    <section class="flex justify-between p-3 border-b">
      <div class="flex items-center">
        <XButton label="筛选" class="mr-2" icon="lucide:filter" @click="store.visibleSearch = true" />
        <XButton label="清空筛选" variant="outline" icon="lucide:x" @click="resetSearch" />

        <hr class="h-6 w-px mx-4 bg-border" />

        <XButton color="success" label="手续费设置" icon="iconoir:settings" @click="feeDialog = true" />

        <hr class="h-6 w-px mx-4 bg-border" />

        <XButton color="danger" label="批量删除" icon="lucide:trash-2" @click="handleDelete" />
      </div>

      <XPagination v-model="store.page" v-model:limit="store.limit" :total="store.recharges.total" :layouts="[
        'total',
        'prev',
        'pager',
        'next',
        'sizes',
        'jumper',
      ]" />
    </section>

    <div class="p-3 pb-0">
      <XTable ref="tableRef" :columns="columns" :data="store.recharges.list" :loading="loading" selection
        row-key="paymentId" selected-key="paymentId" class="border h-[calc(100vh-8.75rem)]"
        @select-change="ids = $event" />
    </div>

    <RechargeSearch :key="queryHash" />
    <RechargeDialog />

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

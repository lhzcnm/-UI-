<script setup lang="ts">
import RechargeSearch from './components/RechargeSearch.vue'
import RechargeDialog from './components/RechargeDialog.vue'

import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'
import dayjs from 'dayjs'

import type { RechargeListParams, RechargeUpdateParams } from '@/inters/recharge'
import { deleteRecharges, getRecharges } from '@/api/recharge'
import { zRechargeSearchForm } from '@/inters/recharge'

import type { RechargeStore } from './utils'
import { columns } from './utils/column'
import { RECHARGE_STORE } from './utils'

const store: RechargeStore = reactive({
  recharges: { list: [], total: 0, page: 1, pageSize: 20 },
  formSearch: zRechargeSearchForm.parse({}),
  formUpdate: {} as RechargeUpdateParams,
  visibleSearch: false,
  visibleUpdate: false,
  index: undefined,
  refresh: false,
  page: 1,
  limit: 20,
})

provide(RECHARGE_STORE, store)

const route = useRoute()
const router = useRouter()

const ids = ref<number[]>([])
const loading = ref(false)

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
    if (q === 'today') {
      const format = 'YYYY-MM-DD HH:mm:ss'
      store.formSearch.startTime = dayjs().startOf('day').format(format)
      store.formSearch.endTime = dayjs().endOf('day').format(format)
    }

    store.formSearch = {
      ...store.formSearch,
      userId: uid ? Number(uid) : undefined,
      byAdmin: q === 'admin',
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
  store.formSearch = zRechargeSearchForm.parse({})
  router.replace({
    path: route.path,
    query: { q: route.query.q },
  })
}

async function handleDelete() {
  if (ids.value.length === 0) return toast.warning('请选择要删除的充值记录')
  if (!await xconfirm('确定要删除这些充值记录吗？')) return

  deleteRecharges(ids.value).then(() => {
    store.refresh = !store.refresh
  })
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
          icon="lucide:x"
          @click="resetSearch"
        />

        <hr class="h-6 w-px mx-4 bg-border" />

        <XButton
          color="danger"
          label="批量删除"
          icon="lucide:trash-2"
          @click="handleDelete"
        />
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
        :total="store.recharges.total"
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
        :data="store.recharges.list"
        :loading="loading"
        selection
        row-key="paymentId"
        selected-key="paymentId"
        class="border h-[calc(100vh-8.75rem)]"
        @select-change="ids = $event"
      />
    </div>

    <RechargeSearch />
    <RechargeDialog />
  </div>
</template>

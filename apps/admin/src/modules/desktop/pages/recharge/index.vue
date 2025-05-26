<script setup lang="ts">
import RechargeSearch from './components/RechargeSearch.vue'

import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'

import { zRechargeSearchForm, type RechargeListParams } from '@/inters/recharge'
import { deleteRecharges, getRecharges } from '@/api/recharge'

import type { RechargeStore } from './utils'
import { RECHARGE_STORE } from './utils'
import { columns } from './utils/column'

import dayjs from 'dayjs'

const route = useRoute()

const store: RechargeStore = reactive({
  recharges: { list: [], total: 0, page: 1, pageSize: 20 },
  formSearch: zRechargeSearchForm.parse({}),
  visibleSearch: false,
  index: undefined,
  refresh: false,
  page: 1,
  limit: 20,
})

provide(RECHARGE_STORE, store)

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
  { immediate: true },
)

watch(
  () => route.query,
  (value) => {
    store.formSearch = zRechargeSearchForm.parse({})

    if (value.q === 'today') {
      store.formSearch.startTime = dayjs().startOf('day').format('YYYY-MM-DD HH:mm:ss')
      store.formSearch.endTime = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    }
    if (value.q === 'admin') {
      store.formSearch.byAdmin = true
    }
    store.refresh = !store.refresh
  },
  { immediate: true },
)

function getList(params: RechargeListParams) {
  loading.value = true

  const response = getRecharges(params)
  response.then((data) => store.recharges = data)
  response.finally(() => loading.value = false)
}

async function handleDelete() {
  if (ids.value.length === 0) {
    return toast.warning('请选择要删除的充值记录')
  }

  if (!await xconfirm('确定要删除这些充值记录吗？')) return
  await deleteRecharges(ids.value)
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="space-x-2">
        <XButton
          icon="lucide:filter" label="筛选"
          @click="store.visibleSearch = true"
        />
        <XButton
          color="danger" icon="lucide:trash"
          label="删除" @click="handleDelete"
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
  </div>
</template>

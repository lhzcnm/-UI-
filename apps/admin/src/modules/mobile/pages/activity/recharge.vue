<script setup lang="ts">
import ActivityRechargeCard from './components/ActivityRechargeCard.vue'

import { ACTIVITY_STATUS } from '@3un/utils'

import { zRechargeSearchForm, type RechargeListParams } from '@/inters/recharge'
import { ACTIVITY_RECHARGE_STORE, type ActivityRechargeStore } from './utils'
import { createList, defaultPageSize } from '@/utils'
import { zActivyVoucherForm } from '@/inters/voucher/activity'
import { zActivyRecharge } from '@/inters/activity/recharge'
import { getActivitys, getActivyRecharges } from '@/api/activity'

const store: ActivityRechargeStore = reactive({
  visibleCreate: false,
  visibleSearch: false,

  activityId: 0,

  formSearch: zRechargeSearchForm.parse({}),

  activitys: [],

  recharges: createList(),
  formCreate: zActivyVoucherForm.parse({}),
  payment: zActivyRecharge.parse({}),

  refresh: false,
  page: 1,
  limit: defaultPageSize,
})

provide(ACTIVITY_RECHARGE_STORE, store)

const loading = ref<boolean>(false)

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  async ([pageVal, limitVal]) => {
    await getRechargeList({
      ...store.formSearch,
      page: pageVal,
      pageSize: limitVal,
    })
  }
)

watch(
  () => store.activityId,
  (val) => {
    const data = store.activitys.find(item => item.id === val)!

    store.formSearch.startTime = data.startTime
    store.formSearch.endTime = data.endTime
    store.page = 1
    store.refresh = !store.refresh
  }
)

async function getActivityList() {
  try {
    const data = await getActivitys({
      status: ACTIVITY_STATUS.ENABLE,
    })

    store.activitys = data

    if (data.length > 0) {
      store.activityId = data[0].id
    }
  } catch {  }
}

async function getRechargeList(params: RechargeListParams) {
  try {
    loading.value = true
    const data = await getActivyRecharges(params)
    store.recharges = data
  } catch {} finally {
    loading.value = false
  }
}

function openSearch() {
  store.visibleSearch = true
}

await getActivityList()
</script>

<template>
  <div>
    <Toolbar :loading="loading">
      <template #default>
        <XSimplePagination
          :total="store.recharges.total"
          v-model="store.page"
          :limit="store.limit"
        />
      </template>

      <template #extra>
        <div class="flex items-center space-x-2">
          <XNativeSelect
            v-model="store.activityId"
            :options="store.activitys"
            label-key="name"
            value-key="id"
            @click.stop
          />
          <XButton
            label="筛选"
            icon="lucide:filter"
            @click="openSearch"
          />
          <XButton
            label="请空筛选"
            variant="outline"
            icon="lucide:x"
          />
        </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <template v-if="!loading && store.recharges.total === 0">
        <NoMessage
          class="h-auto bg-card border rounded-lg p-3" />
      </template>

      <template v-else v-for="(item, index) in store.recharges.list">
        <ActivityRechargeCard :item="item" :index="index" />
      </template>
    </section>
  </div>
</template>

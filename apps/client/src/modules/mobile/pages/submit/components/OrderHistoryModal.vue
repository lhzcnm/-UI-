<script setup lang="ts">
import { orderApi, type OrderListParams, type OrderListResponse, type OrderSearchForm } from '@/api/orders'
import { SUBMIT_STORE } from '../utils'
import { createList } from '@/utils'
import { downloadURL } from '@3un/utils'
import OrderSearchModal from './OrderSearchModal.vue'

interface OrderHistoryModalProps {
  serviceId: number
}

const { t } = useI18n()

const props = defineProps<OrderHistoryModalProps>()

const store = inject(SUBMIT_STORE)!

const page = ref<number>(1)
const pageSize = ref<number>(50)
const orders = ref<OrderListResponse>(createList())
const refresh = ref<boolean>(false)
const visibleSearch = ref<boolean>(false)

watch(
  () => store.visibleHistory,
  (val) => val && (initData())
)

watch(
  [() => page.value, () => refresh.value],
  async ([pageVal]) => {
    await getOrderData({
      serviceId: props.serviceId,
      page: pageVal,
      pageSize: pageSize.value
    })
  }
)

async function initData() {
  page.value = 1

  await getOrderData({
    serviceId: props.serviceId,
    page: page.value,
    pageSize: pageSize.value,
  })
}

async function getOrderData(params: OrderListParams) {
  const { data } = await orderApi.list(params)
  orders.value = data
}

async function exportOrder() {
  const orderIds = orders.value.list.map(o => o.id.toString())

  try {
    const { data } = await orderApi.export({
      serviceId: props.serviceId,
      orderIdList: orderIds,
    })

    downloadURL(data)
  } catch {}
}

function openFilter() {
  visibleSearch.value = true
}

async function handleFilter(params: OrderSearchForm) {
  page.value = 1
  await getOrderData({
    serviceId: props.serviceId,
    imeiList: params.imei ? params.imei.split('\n') : undefined,
    codeIdList: params.codeIds ? params.codeIds?.split('\n') : undefined,
    status: params.status === -1 ? undefined : params.status,
    startTime: params.startTime,
    endTime: params.endTime,
    page: page.value,
    pageSize: pageSize.value,
  })
}
</script>

<template>
  <SlideRight
    v-model="store.visibleHistory"
    :title="t('query.title.history')"
    header-class="border-b"
    ui-body="flex flex-col"
  >
    <template #default>
      <section class="p-3 flex justify-between border-b">
        <div class="flex items-center space-x-2">
          <ButtonGroup
            :layouts="['filter', 'export']"
            @export="exportOrder"
            @filter="openFilter"
          />
        </div>
        <XSimplePagination
          v-model="page"
          :limit="pageSize"
          :total="orders.total"
        />
      </section>

      <section class="mt-2 p-3 flex flex-col space-y-2 overflow-y-auto">
        <NoMessage
          v-if="orders.list.length === 0"
          class="bg-card border rounded-lg"
        />

        <template v-else>
          <OrderCard
            v-for="order in orders.list" :key="order.id"
            :order="order"
            :visible-image="false"
            class="border rounded"
          />
        </template>
      </section>

      <OrderSearchModal v-model="visibleSearch" @filter="handleFilter" />
    </template>
  </SlideRight>
</template>

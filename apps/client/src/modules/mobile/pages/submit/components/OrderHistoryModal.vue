<script setup lang="ts">
import { orderApi, type OrderListParams, type OrderListResponse, type OrderSearchForm } from '@/api/orders'
import { SUBMIT_STORE } from '../utils'
import { createList } from '@/utils'
import { downloadURL } from '@3un/utils'
import OrderSearchModal from './OrderSearchModal.vue'

interface OrderHistoryModalProps {
  serviceId: number
}

const localStore = useLocalStore()

const props = defineProps<OrderHistoryModalProps>()

const exportDialog = ref<boolean>(false)
const fileName = ref<string | undefined>()
const store = inject(SUBMIT_STORE)!

const page = ref<number>(1)
const pageSize = ref<number>(50)
const orders = ref<OrderListResponse>(createList())
const refresh = ref<boolean>(false)
const visibleSearch = ref<boolean>(false)
const options: any[] = [
  { label: localStore.localData['submit_PrevOrders'], value: 'last', icon: '' },
  { label: localStore.localData['submit_AllOrders'], value: 'all', icon: '' },
]

const orderTab = ref<string>('last')
watch(
  () => store.visibleHistory,
  (val) => val && (initData())
)

watch(
  () => orderTab.value,
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
  const orderIds = orderTab.value == 'all' ? undefined : JSON.parse(localStorage.getItem('codeIds')!)
  const size = orderTab.value == 'all' ? pageSize.value : 1000

  await getOrderData({
    serviceId: props.serviceId,
    page: page.value,
    pageSize: size,
    codeIdList: orderIds
  })
}

async function getOrderData(params: OrderListParams) {
  const { data } = await orderApi.list(params)
  orders.value = data
}

async function exportOrder() {
  const orderIds = orderTab.value == 'all' ? undefined : JSON.parse(localStorage.getItem('codeIds')!)

  try {
    const { data } = await orderApi.export({
      serviceId: props.serviceId,
      orderIdList: orderIds,
      fileName: fileName.value
    })

    downloadURL(data)
    exportDialog.value = false
    fileName.value = undefined
  } catch { }
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
    :title="localStore.localData['submit_OrdersHistory']"
    header-class="border-b"
    ui-body="flex flex-col"
    :touch-prevent-default="true"
  >
    <template #default>
      <section class="flex justify-evenly mt-2 fixed right-2 -top-0">
        <XSegmented v-model="orderTab" :options="options" class="bg-card text" />
      </section>

      <section class="p-2 flex justify-between border-b">
        <div class="flex items-center space-x-2">
          <ButtonGroup 
          :labels="{filter: localStore.localData['submit_Filter'], export: localStore.localData['submit_Export']}"
          :layouts="orderTab == 'all'? ['filter', 'export'] : [ 'export']" @export="exportDialog = true" @filter="openFilter" />
        </div>
        <XSimplePagination v-if="orderTab == 'all'" v-model="page" :limit="pageSize" :total="orders.total" />
      </section>

      <section class="mt-2 p-3 flex flex-col space-y-2 overflow-y-auto" @touchmove.stop>
        <NoMessage v-if="orders.list.length === 0" class="bg-card border rounded-lg" />

        <template v-else>
          <OrderCard v-for="order in orders.list" :key="order.id" :order="order" :visible-image="false"
            class="border rounded" />
        </template>
      </section>

      <OrderSearchModal v-model="visibleSearch" @filter="handleFilter" />
    </template>
  </SlideRight>
  

  <XDialog v-model="exportDialog" :maskClosable="false" ui-root="p-0 sm:p-0 sm:max-w-[450px]"
      :title="localStore.localData['history_SelectFileTypes']" draggable>

      <template #header>
        <div class="p-2 border-b">
          <div class="w-full text-center">{{ localStore.localData['history_ExportName'] }}</div>
          <div @click="exportDialog = false" class="fixed top-1 right-4">x</div>
        </div>
      </template>

      <section class="flex flex-col justify-center items-center space-y-2 mx-auto px-6 py-2">

        <XInput v-model="fileName" class="w-2/3" :placeholder="localStore.localData['history_ExportFileName']" />
        <div class="text-sm text-center text-muted-foreground mb-2">{{ localStore.localData['history_CustomFileName'] }}</div>

      </section>


      <div class="p-2 border-t">
        <XButton class="w-full" variant="soft"  @click="exportOrder">{{
          localStore.localData['history_ExportOrder'] }}
        </XButton>
      </div>
    </XDialog>
</template>

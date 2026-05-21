<script setup lang="ts">
import { toast } from 'vue-sonner'

import { type OrderTableView, orderApi } from '@/api/orders'
import { getLanuagestring } from '@/utils/constant'
import { SUBMIT_STORE } from '../utils/index'

interface UnlockRecommendActionProps {
  order: OrderTableView,
}

const props = defineProps<UnlockRecommendActionProps>()

const store = inject(SUBMIT_STORE)!
const iStore = useSystemStore()

async function getOrderDetail() {
  const { data } = await orderApi.item(props.order.id!)
  const index = store.rawOrders.findIndex(o => o.id === props.order.id)
  if (index !== -1) {
    store.rawOrders[index] = {
      ...store.rawOrders[index],
      recommends: data.recommends,
    }
  }
}

async function openUnlockRecommend() {
  if (props.order.isStorage) {
    await getOrderDetail()
  }

  if (!props.order.recommends || props.order.recommends.length === 0) {
    toast.warning(getLanuagestring('no_unlock_recommend', iStore.lang))
    return
  }
  store.selectOrderId = props.order.id!
  store.visibleUnlockRecommend = true
}
</script>

<template>
  <XButton
    :label="getLanuagestring('unlock_recommend', iStore.lang)"
    size="sm"
    @click="openUnlockRecommend"
  />
</template>

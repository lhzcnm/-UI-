<script setup lang="ts">
import { toast } from 'vue-sonner'

import { type OrderTableView } from '@/api/orders'
import { getLanuagestring } from '@/utils/constant'
import { unlockRecommentConfirm } from '@/utils/serviceFieldConfirm'

interface UnlockRecommendActionProps {
  order: OrderTableView,
}

const props = defineProps<UnlockRecommendActionProps>()

// const store = inject(SUBMIT_STORE)!
const iStore = useSystemStore()

// async function getOrderDetail() {
//   const { data } = await orderApi.item(props.order.id!)

//   return data
// }

async function openUnlockRecommend() {
  // let order: Order | null = null

  // if (props.order.isStorage) {
  //   order = await getOrderDetail()
  // }

  if (!props.order.recommends || props.order.recommends.length === 0) {
    toast.warning(getLanuagestring('no_unlock_recommend', iStore.lang))
    return
  }

  unlockRecommentConfirm({order: props.order})
}
</script>

<template>
  <XButton
    :label="getLanuagestring('unlock_recommend', iStore.lang)"
    size="sm"
    @click="openUnlockRecommend"
  />
</template>

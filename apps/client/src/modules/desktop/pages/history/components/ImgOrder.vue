<script setup lang="ts">
import type { ImgOrderItem } from '../types'
import { HISTORY_STORE } from '../utils'

interface ImgOrderProps {
  imgOrders: ImgOrderItem[],
}

interface ImgOrderEmits {
  close: []
}

const { imgOrders } = defineProps<ImgOrderProps>()

const emits = defineEmits<ImgOrderEmits>()

const store = inject(HISTORY_STORE)!

const localStore = useLocalStore()

function handleClick(order: ImgOrderItem) {
  const a = document.createElement('a')
  
  a.href = order.img
  a.download = `${order.id}_${order.imei}`
  a.click()
  a.remove()
}
</script>

<template>
  <XDialog
    v-model="store.visibleOrderImg" maskClosable draggable
    :title="localStore.localData['history_OrderImage']"
    uiRoot="sm:max-w-full h-[calc(100vh-10rem)] flex flex-col w-auto"
    @close="emits('close')"
  >
    <template #default>
      <div class="h-full overflow-auto flex flex-col space-y-2">
        <div class="border rounded relative" v-for="(order) in imgOrders" :key="order.id">
          <img class="border m-2" :src="order.img" :alt="`${order.id}_${order.imei}`">
          <div class="absolute top-2 right-2 z-20">
            <XButton variant="ghost" :label="localStore.localData['history_DownloadImage']" @click="handleClick(order)" />
          </div>
        </div>
      </div>
    </template>
  </XDialog>
</template>

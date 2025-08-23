<script setup lang="ts">
import type { ImgOrderItem } from '../types';
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
    v-model="store.visibleOrderImg" maskClosable draggable title="图片展示"
    uiRoot="sm:max-w-[32rem] h-[calc(100vh-10rem)] flex flex-col"
    @close="emits('close')"
  >
    <template #default>
      <div class="h-full overflow-auto flex flex-col gap-2">
        <template v-if="imgOrders.length === 0">
          <span>这里空空如也</span>
        </template>
        <template v-else>
          <div class="border rounded relative" v-for="(order) in imgOrders" :key="order.id">
            <img :src="order.img" :alt="`${order.id}_${order.imei}`">
            <div class="absolute top-2 right-2 z-20">
              <XButton variant="ghost" label="下载" @click="handleClick(order)" />
            </div>
          </div>
        </template>
      </div>
    </template>
  </XDialog>
</template>

<script setup lang="ts">
import type { ImgOrderItem } from '../types'
import { HISTORY_STORE } from '../utils'

interface ImgOrderProps {
  imgOrder: ImgOrderItem,
}

interface ImgOrderEmits {
  close: [],
}

const emits = defineEmits<ImgOrderEmits>()
const store = inject(HISTORY_STORE)!

const localStore = useLocalStore()

const { imgOrder } = defineProps<ImgOrderProps>()
</script>

<template>
  <SlideRight
    :title="localStore.localData['history_OrderImage']"
    v-model="store.visibleImg"
    ui-body="flex flex-col"
    @close="emits('close')"
    :touch-prevent-default="false"
  >
    <template #default>
      <div class="flex flex-col px-2 max-h-[calc(100vh-100px)] overflow-y-auto">
        <img :src="imgOrder.img" alt="">
  
        <div class="my-4 flex justify-center">
          <a
            :href="imgOrder.img" 
            :download="`${imgOrder.id}_${imgOrder.imei}.png`"
            class="px-5 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dark transition"
          >
            {{ localStore.localData['history_DownloadImg'] }}
          </a>
        </div>
      </div>
    </template>
  </SlideRight>
</template>

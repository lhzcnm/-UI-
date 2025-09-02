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

const { imgOrder } = defineProps<ImgOrderProps>()
</script>

<template>
  <SlideRight
    title="生成图片" v-model="store.visibleImg"
    @close="emits('close')"
  >
    <template #default>
      <div class="px-2">
        <img :src="imgOrder.img" alt="">
  
        <div class="my-4 flex justify-center">
          <a
            :href="imgOrder.img" 
            :download="`${imgOrder.id}_${imgOrder.imei}.png`"
            class="px-5 py-2 bg-primary text-white rounded-md shadow hover:bg-primary-dark transition"
          >
            下载图片
          </a>
        </div>
      </div>
    </template>
  </SlideRight>
</template>

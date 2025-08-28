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
        <!-- <div class="bg-background rounded-xl shadow-md border border-border p-6 max-w-[400px] mx-auto">
          
          <div class="text-center border-b border-border pb-2 mb-4">
            <h2 class="text-lg font-bold">订单凭证</h2>
            <p class="text-sm">ID: {{ imgOrder.id }} ｜ IMEI: {{ imgOrder.imei }}</p>
          </div>
  
          <div class="relative">
            <img 
              v-show="imageLoaded"
              class="border border-border object-contain max-w-full max-h-80 mx-auto"
              :src="imgOrder.img" 
              :alt="`订单${imgOrder.id} - ${imgOrder.imei}`"
              @load="onImageLoad"
              @error="onImageError"
            />
            <p v-if="imageError" class="text-danger text-center">图片加载失败</p>
          </div>
  
          <div class="mt-4 text-center text-xs">
            <p>生成时间：{{ new Date().toLocaleString() }}</p>
          </div>
        </div> -->
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

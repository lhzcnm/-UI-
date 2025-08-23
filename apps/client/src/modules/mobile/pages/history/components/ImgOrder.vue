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

// 图片加载状态
const imageLoaded = ref(false)
const imageError = ref(false)

function onImageLoad() {
  imageLoaded.value = true
}

function onImageError() {
  imageError.value = true
}
</script>

<template>
  <SlideRight
    title="生成图片" v-model="store.visibleImg"
    @close="emits('close')"
  >
    <template #default>
      <div class="p-4 flex flex-col items-center gap-4">
        <div class="relative group">
          <img 
            v-show="imageLoaded"
            class="border-2 border-border rounded-lg shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 object-contain max-w-full max-h-96"
            :src="imgOrder.img" 
            :alt="`订单${imgOrder.id} - ${imgOrder.imei}`"
            @load="onImageLoad"
            @error="onImageError"
          />
        </div>
        
        <a
          :href="imgOrder.img" 
          :download="`${imgOrder.id}_${imgOrder.imei}.png`"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <span>下载图片</span>
        </a>
      </div>
    </template>
  </SlideRight>
</template>

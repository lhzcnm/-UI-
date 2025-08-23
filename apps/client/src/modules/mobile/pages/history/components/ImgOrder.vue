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
      <div class="p-2 flex flex-col items-center">
        <img :src="imgOrder.img" :alt="imgOrder.img" />
        <a
          :href="imgOrder.img" :download="`${imgOrder.id}_${imgOrder.imei}`"
          class="text-primary"
        >
          点击下载图片
        </a>
      </div>
    </template>
  </SlideRight>
</template>

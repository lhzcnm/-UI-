<script setup lang="ts">
import { useImagePreview } from '../composables/useImagePreview'

const {
  previewState,
  scale,
  translateX,
  translateY,
  isDragging,
  imageContainer,
  openPreview,
  closePreview,
  prevImg,
  nextImg,
  goToIndex,
  onWheel,
  onDoubleClick,
  onMouseDown,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel
} = useImagePreview()

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}

defineExpose({
  openPreview,
  closePreview,
  prevImg,
  nextImg,
  goToIndex,
  previewState
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="previewState.visible"
      class="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center select-none"
      @click.self="closePreview"
      @wheel.prevent="onWheel"
      @dblclick="onDoubleClick"
    >
      <!-- 关闭按钮 -->
      <button
        @click="closePreview"
        class="absolute top-4 right-4 z-10 p-2 hover:bg-white/20 rounded-full text-white transition"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- 图片容器 -->
      <div
        ref="imageContainer"
        class="relative w-full flex-1 flex items-center justify-center overflow-hidden"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchCancel"
      >
        <img
          :src="previewState.currentImg"
          alt="预览"
          class="max-h-full max-w-full object-contain transition-none"
          :style="{
            transform: `scale(${scale}) translate(${translateX / scale}px, ${translateY / scale}px)`,
            cursor: scale > 1 ? 'grab' : 'default'
          }"
          draggable="false"
          @error="handleImageError"
        />
      </div>

      <!-- 左右切换按钮 -->
      <button
        v-if="previewState.images.length > 1"
        @click="prevImg"
        class="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 bg-black/30 rounded-full transition"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-if="previewState.images.length > 1"
        @click="nextImg"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 bg-black/30 rounded-full transition"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- 页码 -->
      <div class="absolute bottom-20 left-0 right-0 text-center text-white/80 text-sm">
        {{ previewState.currentIndex + 1 }} / {{ previewState.images.length }}
      </div>
    </div>
  </Teleport>
</template>


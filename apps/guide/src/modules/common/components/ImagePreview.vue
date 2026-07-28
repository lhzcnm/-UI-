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
  <div 
    v-if="previewState.visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-[2vw]"
    @click.self="closePreview"
  >
    <div class="relative bg-white rounded-[1.5vh] shadow-2xl w-[50vw] h-[75vh] flex flex-col overflow-hidden">
      <button 
        @click="closePreview"
        class="absolute top-[1.5vh] right-[1.5vh] text-gray-400 hover:text-gray-700 text-[3vh] transition-colors z-10 w-[4vh] h-[4vh] flex items-center justify-center"
      >✕</button>

      <div
        ref="imageContainer"
        class="relative flex-1 min-h-0 bg-gray-50 overflow-hidden select-none touch-none"
        style="will-change: transform;"
        tabindex="-1"
        @wheel="onWheel"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchCancel"
        @dblclick="onDoubleClick"
      >
        <img
          :src="previewState.currentImg"
          class="w-full h-full object-contain no-focus-outline pointer-events-none"
          :style="{
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
          }"
          loading="lazy"
          draggable="false"
        />
        <div class="absolute bottom-[2vh] left-1/2 -translate-x-1/2 bg-black/50 text-white px-[1.5vw] py-[0.5vh] rounded-full backdrop-blur-sm pointer-events-none text-[1.8vh]">
          {{ previewState.currentIndex + 1 }} / {{ previewState.images.length }}
        </div>
        <div class="absolute top-[2vh] left-[2vh] bg-black/50 text-white px-[1vw] py-[0.4vh] rounded-full backdrop-blur-sm pointer-events-none text-[1.8vh]">
          {{ Math.round(scale * 100) }}%
        </div>
      </div>
      <button 
        v-if="previewState.images.length > 1"
        @click="prevImg"
        class="absolute left-[1vw] top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 text-[4vh] transition-colors bg-white/80 rounded-full w-[5vh] h-[5vh] flex items-center justify-center shadow-lg"
      >‹</button>
      <button 
        v-if="previewState.images.length > 1"
        @click="nextImg"
        class="absolute right-[1vw] top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 text-[4vh] transition-colors bg-white/80 rounded-full w-[5vh] h-[5vh] flex items-center justify-center shadow-lg"
      >›</button>
    </div>
  </div>
</template>

<style scoped>
.no-focus-outline {
  -webkit-user-select: none ;
  user-select: none ;
  -webkit-touch-callout: none ;
  -webkit-tap-highlight-color: transparent ;
  outline: 0 ;
  outline-style: none ;
  -webkit-focus-ring-color: transparent ;
}
img {
  -ms-user-select: none;
  -webkit-user-drag: none;
  user-drag: none;
}
</style>
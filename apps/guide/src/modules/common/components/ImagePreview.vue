<template>
  <div 
    v-if="previewState.visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-[2vw]"
    @click.self="closePreview"
  >
    <div 
      class="relative bg-white rounded-[1.5vh] shadow-2xl w-[50vw] h-[75vh] flex flex-col overflow-hidden"
      @click.self="closePreview"
    >
      <!-- 关闭按钮 -->
      <button 
        @click.stop="closePreview"
        class="absolute top-[1.5vh] right-[1.5vh] text-gray-400 hover:text-gray-700 text-[3vh] transition-colors z-10 w-[4vh] h-[4vh] flex items-center justify-center bg-white/80 rounded-full hover:bg-white shadow-md"
      >✕</button>

      <!-- 图片容器 -->
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
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }"
          loading="lazy"
          draggable="false"
          @load="applyBoundaries"
          @error="() => console.error('图片加载失败:', previewState.currentImg)"
        />
        
        <!-- 缩放比例 - 左上角，只在不是100%时显示 -->
        <div 
          v-if="scale !== 1"
          class="absolute top-[2vh] left-[2vh] bg-black/60 text-white px-[1.2vw] py-[0.6vh] rounded-full backdrop-blur-sm pointer-events-none text-[1.8vh] font-medium z-10 shadow-lg"
        >
          {{ Math.round(scale * 100) }}%
        </div>
        
        <!-- 页码 - 底部居中 -->
        <div class="absolute bottom-[2vh] left-1/2 -translate-x-1/2 bg-black/50 text-white px-[1.5vw] py-[0.5vh] rounded-full backdrop-blur-sm pointer-events-none text-[1.8vh] z-10">
          {{ previewState.currentIndex + 1 }} / {{ previewState.images.length }}
        </div>
        
        <!-- 缩放提示 -->
        <div 
          v-if="scale === 1 && previewState.visible"
          class="absolute bottom-[8vh] left-1/2 -translate-x-1/2 text-white/60 text-[1.6vh] pointer-events-none whitespace-nowrap z-10"
        >
          🖱️ 滚轮缩放 · 拖动平移
        </div>
      </div>

      <!-- 导航按钮 -->
      <button 
        v-if="previewState.images.length > 1"
        @click.stop="prevImg"
        class="absolute left-[1vw] top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 text-[4vh] transition-colors bg-white/80 hover:bg-white rounded-full w-[5vh] h-[5vh] flex items-center justify-center shadow-lg z-10"
      >‹</button>
      
      <button 
        v-if="previewState.images.length > 1"
        @click.stop="nextImg"
        class="absolute right-[1vw] top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 text-[4vh] transition-colors bg-white/80 hover:bg-white rounded-full w-[5vh] h-[5vh] flex items-center justify-center shadow-lg z-10"
      >›</button>
    </div>
  </div>
</template>

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
  onTouchCancel,
  applyBoundaries
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

<style scoped>
.no-focus-outline {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  outline: 0;
  outline-style: none;
}

img {
  -ms-user-select: none;
  -webkit-user-drag: none;
  user-drag: none;
}

.overflow-hidden {
  overflow: hidden !important;
}

button {
  user-select: none;
}

/* 百分比显示淡入淡出效果 */
.absolute {
  transition: opacity 0.3s ease;
}
</style>

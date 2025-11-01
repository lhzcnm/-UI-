<script setup lang="ts">
const props = defineProps<{ isDialog: boolean }>()
const emit = defineEmits<{ (e: 'update:isDialog', value: boolean): void }>()

/** 点击遮罩关闭弹窗 */
function closeDialogByClick() {
  emit('update:isDialog', false)
}
</script>

<template>
  <transition name="fade">
    <!-- 遮罩层 -->
    <div
      v-if="props.isDialog"
      class="fixed inset-0 p-2 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999]"
      @click="closeDialogByClick"
    >
      <transition name="popup">
        <!-- 弹窗主体 -->
        <div
          class="w-1/3 h-full bg-white rounded-md shadow-xl overflow-hidden relative"
          @click.stop
        >
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
/* 遮罩淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 弹窗缩放动画 */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.4s ease;
}
.popup-enter-from,
.popup-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>

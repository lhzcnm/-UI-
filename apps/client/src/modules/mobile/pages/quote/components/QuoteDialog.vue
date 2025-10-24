<script setup lang="ts">

const props = defineProps<{ isDialog: boolean }>()
const emit = defineEmits<{ (e: 'update:isDialog', value: boolean): void }>()

function closeDialogByClick() {
  emit('update:isDialog', false)
}
</script>

<template>
  <transition name="fade">
    <div
      v-if="props.isDialog"
      class="fixed inset-0 flex items-center justify-center p-2"
    >
      <div class="absolute inset-0 bg-black/50" @click="closeDialogByClick"></div>

      <transition name="popup">
        <div
          v-if="props.isDialog"
          class="relative w-96 h-96 placeholder:rounded-xl shadow-lg"
        >
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

<script setup lang="ts">

const props = defineProps<{ isDialog: boolean }>()
const emit = defineEmits<{ (e: 'update:isDialog', value: boolean): void }>()

function closeDialogByClick() {
  emit('update:isDialog', false)
}
</script>

<template>
  <transition name="fade">
      <transition name="popup">
        <div
          v-if="props.isDialog"
          @click="closeDialogByClick"
          class="relative w-full h-full placeholder:rounded-xl shadow-lg"
        >
          <slot></slot>
        </div>
      </transition>
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

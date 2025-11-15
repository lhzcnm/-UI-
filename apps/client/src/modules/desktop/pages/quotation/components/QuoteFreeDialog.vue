<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      @click.self="close"
    >
      <div
        class="w-[90%] max-w-sm rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-6 text-center animate-[fadeIn_0.25s_ease]"
      >
        <div v-if="title" class="text-lg font-semibold text-gray-800 mb-3">
          {{ title }}
        </div>
        <div v-if="message" class="text-sm text-gray-600 mb-6">
          {{ message }}
        </div>

        <slot></slot>

        <div class="flex justify-center gap-4 mt-4">
          <button
            class="px-5 py-2 rounded-full text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-300"
            @click="cancel"
          >
            {{ t(cancelText) }}
          </button>
          <button
            class="px-5 py-2 rounded-full text-white bg-gradient-to-r from-sky-500 to-blue-600 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            @click="confirm"
          >
            {{ t(confirmText) }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const { t } = useI18n()

defineProps({
  modelValue: { type: Boolean, required: true },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  cancelText: { type: String, default: 'button.cancel' },
  confirmText: { type: String, default: 'button.confirm' }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const close = () => emit('update:modelValue', false)
const cancel = () => {
  emit('cancel')
  close()
}
const confirm = () => {
  emit('confirm')
  close()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

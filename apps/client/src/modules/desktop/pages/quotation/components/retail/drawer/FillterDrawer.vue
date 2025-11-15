<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
const { t } = useI18n()
defineProps({
  modelValue: { type: Boolean, default: false }, // 控制抽屉是否打开
  title: { type: String, default: 'quote.Filter' },          // 抽屉标题
  width: { type: String, default: '96' }        // 抽屉宽度，Tailwind 格式，例如 '1/2', '2/3'
})

const emit = defineEmits(['update:modelValue'])

const closeDrawer = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <div class="relative h-screen">
    <!-- 遮罩 -->
    <div
      v-if="modelValue"
      @click="closeDrawer"
      class="fixed inset-0 bg-black bg-opacity-40 z-40"
    ></div>

    <!-- 抽屉 -->
    <transition name="slide-right">
      <div
        v-if="modelValue"
        :class="`fixed top-0 right-0 h-screen bg-white dark:bg-black/80 shadow-lg z-50 flex flex-col p-4 `"
        :style="{ maxWidth: '24rem' }"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">{{ t(title) }}</h2>
          <button @click="closeDrawer" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ✕
          </button>
        </div>

        <!-- 抽屉内容插槽 -->
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0%);
}
</style>

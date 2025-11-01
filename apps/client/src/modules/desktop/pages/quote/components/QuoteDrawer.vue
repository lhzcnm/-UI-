<script setup lang="ts">
const visible = defineModel<boolean>({ required: true })

function closeDrawer() {
  visible.value = false
}
</script>

<template>
  <teleport to="body">
    <transition name="slide-right">
      <div v-if="visible" class="fixed inset-0 flex">
        <!-- 遮罩层，占左半屏 -->
        <div 
          class="flex-1 bg-white/50"
          @click="closeDrawer"
        ></div>

        <!-- 抽屉，占右半屏 -->
        <div 
          class="w-1/2 h-full bg-white"
        >
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>

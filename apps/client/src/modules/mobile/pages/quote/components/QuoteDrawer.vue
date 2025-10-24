<script setup lang="ts">
  const visible = defineModel<boolean>({ required: true })
</script>

<template>
  <teleport to="body">
    <transition name="slide-right">
      <div 
        v-if="visible"
        class="h-screen fixed left-0 right-0 top-0 bottom-0 bg-background"
      >
          <slot></slot>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.2s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>

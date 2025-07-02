<script setup lang="ts">
const toggle = ref(false)
</script>

<template>
  <section class="relative px-3 py-2 border-b">
    <div class="flex items-center justify-between">
      <XButton label="操作" @click="toggle = !toggle" />
      <slot name="right" />
    </div>

    <div
      v-show="toggle"
      class="absolute left-0 top-full w-full h-full flex items-center gap-2 bg-card"
    >
      <slot name="extra" />
    </div>
  </section>
</template>

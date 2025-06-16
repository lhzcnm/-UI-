<script setup lang="ts">
import TheEditor from './components/TheEditor.vue'
</script>

<template>
  <div class="flex space-x-6 p-6">
    <div class="flex-1">
      <TheEditor />
    </div>
    <div class="flex-1">
      <h2 class="text-lg font-bold">预览</h2>
      <div class="border rounded p-4">
        
      </div>
    </div>
  </div>
</template>

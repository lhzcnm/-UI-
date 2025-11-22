<script setup lang="ts">
import { Toaster } from 'vue-sonner'

const store = useSystemStore()
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </template>
  </RouterView>

  <Toaster
    richColors
    position="top-center"
    :theme="store.theme"
  />
</template>

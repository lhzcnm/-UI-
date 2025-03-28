<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import TheHeader from './components/TheHeader.vue'
import { useFullscreen } from '@vueuse/core'

const route = useRoute()
const rootRef = useTemplateRef<HTMLElement>('root')
const { isFullscreen, toggle } = useFullscreen(rootRef)
</script>

<template>
  <div ref="root" class="flex h-screen bg-background">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <TheHeader
        :is-fullscreen="isFullscreen"
        :toggle-fullscreen="toggle"
      />
      <RouterView v-slot="{ Component }" :key="route.path">
        <main
          v-if="Component" ref="mainRef"
          class="flex-1 overflow-y-auto"
        >
          <Transition name="fade-in" mode="out-in">
            <Suspense>
              <component :is="Component" />

              <template #fallback>
                <Fallback />
              </template>
            </Suspense>
          </Transition>
        </main>
      </RouterView>
    </div>
  </div>
</template>

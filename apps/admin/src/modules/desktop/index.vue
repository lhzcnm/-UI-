<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import TheHeader from './components/TheHeader.vue'
import { useFullscreen } from '@vueuse/core'

const route = useRoute()
const iStore = useSystemStore()
const rootRef = useTemplateRef<HTMLElement>('root')
const { isFullscreen, toggle } = useFullscreen(rootRef)
</script>

<template>
  <div ref="root" class="h-screen bg-background">
    <Transition name="sidebar">
      <Sidebar
        v-if="iStore.showSidebar"
        class="fixed top-0 left-0 z-20 h-screen"
      />
    </Transition>

    <div
      class="flex flex-col"
      :class="{ 'ml-sidebar': iStore.showSidebar }"
    >
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

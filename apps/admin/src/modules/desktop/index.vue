<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { twJoin } from 'tailwind-merge'

const route = useRoute()
const iStore = useSystemStore()
const rootRef = useTemplateRef<HTMLElement>('root')
const { isFullscreen, toggle } = useFullscreen(rootRef)

const store = useServiceStore()

await Promise.all([
  store.getItems(),
  store.getGroups(),
])
</script>

<template>
  <div ref="root" class="h-screen">
    <Transition name="slide-left">
      <Sidebar
        v-if="iStore.showSidebar"
        :class="twJoin(
          'fixed top-0 left-0 z-20',
          'w-sidebar h-screen'
        )"
      />
    </Transition>

    <div :class="{ 'ml-sidebar': iStore.showSidebar }">
      <DesktopHeader
        :is-fullscreen="isFullscreen"
        :toggle-fullscreen="toggle"
      />
      <RouterView v-slot="{ Component }" :key="route.path">
        <main
          v-if="Component" ref="mainRef"
          class="h-container overflow-y-auto"
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

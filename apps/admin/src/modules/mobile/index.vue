<script setup lang="ts">
import Fallback from '@/components/Fallback.vue'
import { twJoin } from 'tailwind-merge'

const iStore = useSystemStore()
const route = useRoute()
</script>

<template>
  <div class="flex flex-col h-screen">
    <MobileHeader />
    <RouterView v-slot="{ Component }" :key="route.path">
      <main v-if="Component" class="flex-1 overflow-y-auto">
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

    <Transition name="fade-in">
      <div
        v-if="iStore.showSidebar"
        class="fixed top-0 left-0 size-full bg-black/80"
        @click="iStore.showSidebar = false"
      />
    </Transition>
    <Transition name="slide-left">
      <Sidebar
        v-if="iStore.showSidebar"
        :class="twJoin(
          'fixed top-0 left-0 z-20 w-[75%]',
          'will-change-transform h-screen border-solid'
        )"
      />
    </Transition>
  </div>
</template>

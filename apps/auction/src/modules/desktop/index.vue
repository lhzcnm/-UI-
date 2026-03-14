<script setup lang="ts">
import { useSystemStore } from '@/stores/system'

const infraStore = useInfrastructure()
const iStore = useSystemStore()

await infraStore.getDefaultInfrastructure()
</script>

<template>
  <div class="size-full flex">
    <Transition name="slide-left">
      <template v-if="iStore.showSidebar">
        <Sidebar />
      </template>
    </Transition>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <main class="flex-1 overflow-auto">
          <Suspense>
            <component :is="Component" />

            <template #fallback>
              <FallBack />
            </template>
          </Suspense>
        </main>
      </template>
    </RouterView>
  </div>
</template>

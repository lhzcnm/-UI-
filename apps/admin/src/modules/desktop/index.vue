<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import TheHeader from './components/TheHeader.vue'

const route = useRoute()
</script>

<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <TheHeader />
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
    </div>
  </div>
</template>

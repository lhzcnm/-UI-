<script setup lang="ts">
import { storeAuth } from '@/api/shop'
import TheShopFooter from './components/TheShopFooter.vue'

const shopStore = useShopStore()
const route = useRoute()

async function doAuth() {
  const key = import.meta.env.VITE_GUEST_TOKEN
  if(localStorage.getItem(key)) return

  const data = await storeAuth()
  localStorage.setItem(key, data)
}

function setVh() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)
}
window.addEventListener('resize', setVh)
setVh()

await Promise.all([
  doAuth(),
  shopStore.getServiceList(),
])
</script>

<template>
  <div class="h-[calc(var(--vh,1vh)*100)] w-screen flex flex-col justify-center">
    <RouterView
      v-slot="{ Component }"
    >
      <template v-if="Component">
        <main class="flex-1 overflow-y-auto">
          <Suspense>
            <component :is="Component" />
    
            <template #fallback>
              <FallBack />
            </template>
          </Suspense>
        </main>
      </template>
  
    </RouterView>

    <TheShopFooter v-if="!route.meta.hideFooter" />
  </div>
</template>

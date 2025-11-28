<script setup lang="ts">
import { storeAuth } from '@/api/shop'
import TheShopFooter from './components/TheShopFooter.vue'
import { useUserStore } from '@/stores/user'

const shopStore = useShopStore()
const userStore = useUserStore()
const route = useRoute()

async function doAuth() {
  const key = import.meta.env.VITE_GUEST_TOKEN
  const authKey = import.meta.env.VITE_ACCESS_TOKEN

  const authToken = localStorage.getItem(authKey)
  
  if(authToken) {
    localStorage.removeItem(key)
  }

  const guestToken = localStorage.getItem(key)

  if(guestToken) return

  const data = await storeAuth()
  localStorage.setItem(key, data)
}

function setVh() {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`)
}
window.addEventListener('resize', setVh)
setVh()

await doAuth()
await Promise.all([
  userStore.getUser(),
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

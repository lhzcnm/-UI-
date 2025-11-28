<script setup lang="ts">
import { storeAuth } from '@/api/shop'
import { useUserStore } from '@/stores/user'

const shopStore = useShopStore()
const userStore = useUserStore()

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

await doAuth()

await Promise.all([
  userStore.getUser(),
  shopStore.getServiceList(),
])
</script>

<template>
  <div class="h-screen w-screen flex justify-center">
    <RouterView
      v-slot="{ Component }"
    >
      <template v-if="Component">
        <Suspense>
          <component :is="Component" />
  
          <template #fallback>
            <FallBack />
          </template>
        </Suspense>
      </template>
  
    </RouterView>
  </div>
</template>

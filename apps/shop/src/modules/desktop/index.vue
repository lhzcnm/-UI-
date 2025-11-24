<script setup lang="ts">
import { storeAuth } from '@/api/shop'

const shopStore = useShopStore()
async function doAuth() {
  const key = import.meta.env.VITE_GUEST_TOKEN
  if(localStorage.getItem(key)) return

  const data = await storeAuth()
  localStorage.setItem(key, data)
}

await Promise.all([
  doAuth(),
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

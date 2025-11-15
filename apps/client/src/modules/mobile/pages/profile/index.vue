<script setup lang="ts">
import ProfileCard from './components/ProfileCard.vue'
import BulkApiCard from './components/BulkApiCard.vue'
import ApiKeyCard from './components/ApiKeyCard.vue'
import InfoPlane from './components/InfoPlane.vue'
import FormPlane from './components/FormPlane.vue'
import RechargePlane from './components/RechargePlane.vue'
import QuoteCard from './components/quote/QuoteRealTimeCard.vue'

const store = useUserStore()
const iStore = useSettingStore()

const visibleInfo = ref(false)
await store.getInfo(true)
</script>

<template>
  <div class="px-3">
    <section class="py-4">
      <div class="flex items-center space-x-3">
        <TheAvatar class="size-16" />

        <div class="flex-1">
          <div class="text-xl font-medium mb-1.5">
            {{ store.info.nickname || iStore.settings.title }}
          </div>
          <div class="space-x-2">
            <XTag>ID: {{ store.info.userId }}</XTag>
            <XTag color="danger">{{ store.info.pricePlan }}</XTag>
          </div>
        </div>
      </div>
    </section>

    <ProfileCard v-model="visibleInfo" />
    <InfoPlane v-model="visibleInfo" />
    <QuoteCard/>
    <ApiKeyCard />
    <BulkApiCard />
    <RechargePlane />
    <FormPlane />
  </div>
</template>

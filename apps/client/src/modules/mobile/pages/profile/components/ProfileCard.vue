<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = useUserStore()
const visibleInfo = defineModel<boolean>({ required: true })



const localStore = useLocalStore()

const order = store.info.userOrder
const accountStats = [
   { label: localStore.localData['profile_Balance'], value: store.info.credits },
  { label: localStore.localData['profile_TotalOrders'], value: order.total },
  { label: localStore.localData['profile_Processing'], value: order.total - order.success - order.failed },
]
</script>

<template>
  <section class="mb-3 p-4 bg-card rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-medium">{{ localStore.localData['profile_MyAccount'] }}</h3>
      <button
        class="flex-1 flex items-center justify-end space-x-1 text-sm text-muted-foreground"
        @click="visibleInfo = true"
      >
        {{ localStore.localData['profile_Details'] }} <Icon icon="lucide:chevron-right" class="size-4" />
      </button>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="stat in accountStats"
        :key="stat.label"
        class="text-center"
      >
        <div class="text-lg font-medium mb-1">{{ stat.value }}</div>
        <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
      </div>
    </div>
    <div class="flex space-x-2 mt-4">
      <XButton
        class="w-full" icon="lucide:dollar-sign"
        variant="soft" color="danger"
        @click="$router.push('/m/credits')"
      >
        {{ localStore.localData['profile_Bill'] }}
      </XButton>
      <XButton
        class="w-full" icon="lucide:wallet"
        @click="$router.push('/m/recharge')"
      >
        {{ localStore.localData['profile_Recharge'] }}
      </XButton>
    </div>
  </section>
</template>

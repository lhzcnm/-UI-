<script setup lang="ts">
import { getLanuagestring } from '@/utils/constant'
import { type Order } from '@/api/orders'
import { HISTORY_STORE } from '../utils'

const store = inject(HISTORY_STORE)!
// const serviceStore = useServiceStore()
const router = useRouter()
const iStore = useSystemStore()

const order = computed<Order | undefined>(() => {
  if (store.index) {
    return store.orders.list[store.index] ?? []
  }
  return undefined
})

function handleClickRoute(serviceId: number) {
  if (order.value) {
    router.push(`/submit/${serviceId}/${order.value.imei}`)
    store.visibleUnlockRecommend = false
  }
}
</script>

<template>
  <XDialog
    v-model="store.visibleUnlockRecommend"
    :title="getLanuagestring('unlock_recommend_column', iStore.lang)"
    ui-root="sm:p-0"
    ui-header="p-4 border-b"
  >
    <template #default>
      <div class="px-4 pb-2 max-h-[75vh] flex flex-col gap-2">
        <div
          v-for="(item) in order?.recommends" :key="item.packageId"
          class="px-2 py-1 flex items-center justify-between border rounded gap-2">
          <div class="whitespace-pre-line text-sm">
            {{ item.packageId }} - {{ item.name }}
          </div>
          <XButton
            :label="getLanuagestring('go_to_recommend', iStore.lang)"
            size="sm"
            variant="soft"
            @click="handleClickRoute(item.packageId)"
          />
        </div>
      </div>
    </template>
  </XDialog>
</template>

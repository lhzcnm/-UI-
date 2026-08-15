<script setup lang="ts">
import { getLanuagestring } from '@/utils/constant'
import { registerUnlockRecommentConfirm, type UnlockRecommentOption } from '@/utils/serviceFieldConfirm'
// import { SUBMIT_STORE } from '../utils/index'

// const store = inject(SUBMIT_STORE)!
// const serviceStore = useServiceStore()

const router = useRouter()
const iStore = useSystemStore()

const defaultOptions = ref<UnlockRecommentOption>({} as UnlockRecommentOption)
const visible = ref<boolean>(false)

// const order = computed<OrderTableView | undefined>(() => {
//   const id = store.selectOrderId
//   if (!id) return undefined
//   return store.rawOrders.find(o => o.id === id)
// })

function triggerConfirm(options: UnlockRecommentOption) {
  defaultOptions.value = { ...defaultOptions, order: options.order }
  visible.value = true
}

function handleClickRoute(serviceId: number) {
  if (defaultOptions.value.order) {
    router.push(`/submit/${serviceId}/${defaultOptions.value.order.imei}`)
    visible.value = false
  }
}

registerUnlockRecommentConfirm(triggerConfirm)
</script>

<template>
  <XDialog
    v-model="visible"
    :title="getLanuagestring('unlock_recommend_column', iStore.lang)"
    ui-root="sm:p-0"
    ui-header="p-4 border-b"
  >
    <template #default>
      <div class="px-4 pb-2 max-h-[75vh] flex flex-col gap-2">
        <div
          v-for="(item) in defaultOptions.order.recommends" :key="item.packageId"
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

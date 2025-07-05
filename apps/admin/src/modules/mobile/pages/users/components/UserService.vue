<script setup lang="ts">
import ServiceCard from './ServiceCard.vue'

import { toast } from 'vue-sonner'

import { createUserService, deleteUserService } from '@/api/users'
import { VERIFY_MSG } from '@/utils'
import { USER_STORE } from '../utils'

const store = inject(USER_STORE)!
const loading = ref(false)

const serviceStore = useServiceStore()

function handleSubmit() {
  const { packageId, price } = store.formService

  if (!packageId) {
    toast.warning(VERIFY_MSG.REQ_SERVICE_ID)
    return
  }
  if (price && !/^\d+(\.\d{1,2})?$/.test(price.toString())) {
    toast.warning(VERIFY_MSG.FMT_PRICE)
    return
  }

  loading.value = true

  const response = createUserService({
    packageId: store.formService.packageId,
    userId: store.formService.userId,
    price: store.formService.price || 0,
  })

  response.then((data) => store.services.push(data))
  response.finally(() => loading.value = false)
}

function handleSelect(id: number | string) {
  const servce = serviceStore.itemMap.get(Number(id))
  if (servce) store.formService.price = servce.packagePrice
}

function handleDelete(id: number, index: number) {
  deleteUserService([id]).then(() => {
    store.services.splice(index, 1)
  })
}
</script>

<template>
  <TheModal
    v-model="store.visibleService"
    title="服务价格配置"
  >
    <div class="px-4 space-y-3">
      <NativeSelectService
        v-model="store.formService.packageId"
        @change="handleSelect"
      />

      <div class="flex space-x-2">
        <XInput
          v-model="store.formService.price"
          placeholder="服务价格"
        />
        <XButton
          label="新增"
          icon="lucide:plus"
          @click="handleSubmit"
        />
      </div>
    </div>

    <div class="p-4 space-y-3">
      <h3 class="text-label mb-1">服务列表({{ store.services.length }})</h3>
      <NoMessage v-if="store.services.length === 0" class="border rounded-lg" />

      <template v-else>
        <ServiceCard
          v-for="(service, index) in store.services" :key="service.id"
          :service="service" :index="index"
          @delete="handleDelete"
        />
      </template>
    </div>
  </TheModal>
</template>

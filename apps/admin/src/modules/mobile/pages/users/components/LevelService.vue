<script setup lang="ts">
import ServiceCard from './ServiceCard.vue'

import { toast } from 'vue-sonner'

import { createLevelService, deleteLevelService } from '@/api/level'
import { LEVEL_STORE } from '../utils'
import { VERIFY_MSG } from '@/utils'

const serviceStore = useServiceStore()
const store = inject(LEVEL_STORE)!

const loading = ref(false)

function handleSubmit() {
  const { packageId, price, freeCount } = store.formService

  if (!packageId) {
    toast.warning(VERIFY_MSG.REQ_SERVICE_ID)
    return
  }
  if (price && !/^\d+(\.\d{1,2})?$/.test(price.toString())) {
    toast.warning(VERIFY_MSG.FMT_PRICE)
    return
  }
  if (freeCount && !/^\d+$/.test(freeCount.toString())) {
    toast.warning(VERIFY_MSG.FMT_FREE_COUNT)
    return
  }

  loading.value = true

  const response = createLevelService({
    packageId: store.formService.packageId,
    planId: store.formService.planId,
    price: store.formService.price!,
    freeCount: store.formService.freeCount || 0,
  })

  response.then((data) => store.services.push(data))
  response.finally(() => loading.value = false)
}

function handleSelect(id: number | string) {
  const servce = serviceStore.itemMap.get(Number(id))
  if (servce) store.formService.price = servce.packagePrice
}

function handleDelete(id: number, index: number) {
  deleteLevelService(id).then(() => {
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
      <div>
        <label class="block text-sm text-label mb-1">选择服务</label>
        <ServerSelect
          v-model="store.formService.packageId"
          @change="handleSelect"
        />
      </div>

      <div class="flex space-x-2">
        <div class="flex-1">
          <label class="block text-sm text-label mb-1">服务价格</label>
          <XInput
            v-model="store.formService.price"
            placeholder="服务价格"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm text-label mb-1">免费次数</label>
          <XInput
            v-model="store.formService.freeCount"
            placeholder="免费次数"
          />
        </div>
      </div>

      <div class="flex justify-end">
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

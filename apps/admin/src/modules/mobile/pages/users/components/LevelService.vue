<script setup lang="ts">
import ServiceCard from './ServiceCard.vue'

import type { XNativeSelectValue } from '@3un/ui'
import { toast } from 'vue-sonner'

import { createLevelService, deleteLevelService, updateLevelService } from '@/api/level'
import { LEVEL_STORE } from '../utils'
import { VERIFY_MSG } from '@/utils'
import type { LevelServiceUpdateParams } from '@/inters/level/service'

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

  const index = store.services.findIndex(x => x.packageId === packageId)

  if (index !== -1) {
    const item = store.services[index]
    const response = updateLevelService({
      id: item.id,
      planId: item.planId,
      price: price?.toString(),
      serviceId: item.packageId,
      freeCount: store.formService.freeCount || 0,
    })

    response.then(() => {
      toast.success("更新成功")
      store.services[index].price = price || 0
      store.services[index].freeCount = freeCount || 0
    })
    response.finally(() => loading.value = false)
    
    return
  }

  const response = createLevelService({
    packageId: store.formService.packageId,
    planId: store.formService.planId,
    price: store.formService.price!,
    freeCount: store.formService.freeCount || 0,
  })

  response.then((data) => store.services.push(data))
  response.finally(() => loading.value = false)
}

function handleSelect(value: XNativeSelectValue) {
  const servce = serviceStore.itemMap.get(+value!)
  if (servce) store.formService.price = servce.packagePrice
}

function handleDelete(id: number, index: number) {
  deleteLevelService(id).then(() => {
    store.services.splice(index, 1)
  })
}

async function handleUpdate(
  serviceId: number,
  index: number,
  price: number,
  freeCount: number,
) {
  if (store.index === undefined) return

  const body: LevelServiceUpdateParams = {
    id: store.services[index].id,
    serviceId: serviceId,
    price: price.toString(),
    planId: store.services[store.index].planId,
    freeCount: freeCount
  }

  await updateLevelService(body)
  toast.success("更新成功")
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
        <NativeSelectService
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
          @delete="handleDelete" @update="handleUpdate"
        />
      </template>
    </div>
  </TheModal>
</template>

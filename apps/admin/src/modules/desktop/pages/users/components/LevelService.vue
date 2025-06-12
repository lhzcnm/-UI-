<script setup lang="ts">
import { toast } from 'vue-sonner'

import { createLevelService } from '@/api/level'

import { columns } from '../utils/columnLevelService'
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

function handleSelect(id: number) {
  const servce = serviceStore.itemMap.get(id)
  if (servce) store.formService.price = servce.packagePrice
}
</script>

<template>
  <XDialog
    v-model="store.visibleService"
    title="服务价格配置"
    ui-root="sm:max-w-2xl"
  >
    <div class="flex space-x-2 mb-2">
      <SelectService
        v-model="store.formService.packageId"
        ui-trigger="w-56"
        @selected="handleSelect"
      />
      <XInput
        v-model.number="store.formService.price"
        placeholder="价格"
        ui-root="w-32"
      />
      <XInput
        v-model.number="store.formService.freeCount"
        placeholder="免费次数"
        ui-root="w-32"
      />
      <XButton
        label="添加"
        icon="lucide:plus"
        :loading="loading"
        @click="handleSubmit"
      />
    </div>

    <XTable
      :columns="columns"
      :data="store.services"
      class="border h-[400px]"
    />
  </XDialog>
</template>

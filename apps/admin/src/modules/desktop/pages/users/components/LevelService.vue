<script setup lang="ts">
import { createLevelService } from '@/api/level'
import { columns } from '../utils/columnLevelService'
import { LEVEL_STORE } from '../utils'

const serviceStore = useServiceStore()
const store = inject(LEVEL_STORE)!

const loading = ref(false)
function handleSubmit() {
  loading.value = true

  const response = createLevelService({
    packageId: store.formService.packageId,
    planId: store.formService.planId,
    price: store.formService.price || 0,
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

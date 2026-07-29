<script setup lang="ts">
import { toast } from 'vue-sonner'

import { createUserService, updateUserService } from '@/api/users'
import { VERIFY_MSG } from '@/utils'

import { columns } from '../utils/columnUserService'
import { USER_STORE } from '../utils'

const serviceStore = useServiceStore()
const store = inject(USER_STORE)!

const loading = ref(false)

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

  const index = store.services.findIndex(x => x.packageId === packageId)

  if (index !== -1) {
    const item = store.services[index]
    const response = updateUserService({
      id: item.id,
      userId: item.userId,
      price: price,
      packageId: item.packageId
    })

    response.then(() => {
      toast.success("更新成功")
      store.services[index].price = price || 0
    })
    response.finally(() => loading.value = false)
    
    return
  }
  
  const response = createUserService({
    packageId: store.formService.packageId,
    userId: store.formService.userId,
    price: store.formService.price || 0,
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
    ui-root="sm:max-w-2xl"
    title="服务价格配置"
    draggable
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

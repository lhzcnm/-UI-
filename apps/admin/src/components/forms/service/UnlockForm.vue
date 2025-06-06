<script setup lang="ts">
import type { UnlockCreateParams } from '@/inters/services'

const form = defineModel<UnlockCreateParams>({ required: true })
const serviceStore = useServiceStore()

function handleSelected(value: number) {
  const service = serviceStore.itemMap.get(value)
  if (service) form.value.name = service.packageTitle
}
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-label text-sm mb-1">服务ID</label>
      <SelectService v-model="form.packageId" @selected="handleSelected" />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">服务名称</label>
      <XInput v-model="form.name" placeholder="服务名称" />
    </div>
    <div>
      <label class="block text-label text-sm mb-1">触发关键字</label>
      <XInput v-model="form.operator" placeholder="触发关键字" />
    </div>
  </form>
</template>

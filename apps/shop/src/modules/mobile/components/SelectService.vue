<script setup lang="ts">
import { XNativeSelect } from '@3un/ui'
import type { ClassNameValue } from 'tailwind-merge'

interface SelectServiceProps {
  class: ClassNameValue,
}

const props = defineProps<SelectServiceProps>()

const shopStore = useShopStore()

const serviceId = defineModel<number>({ default: -1 })

const groupId = defineModel<number>("group", { default: -1 })

watch(
  () => groupId.value,
  () => serviceId.value = -1
)

// watch(
//   () => serviceId.value,
//   () => console.log(serviceId)
// )

const groups = computed(() => {
  let res = shopStore.services

  return res.map(item => ({id: item.id, title: item.title}))
})

const services = computed(() => {
  let res = shopStore.services

  if(groupId.value !== -1) {
    res = res.filter(item => item.id === groupId.value)
  }

  return res[0].children
})
</script>

<template>
  <div :class="props.class">
    <XNativeSelect
      :options="groups"
      label-key="title"
      value-key="id"
      v-model="groupId"
      default="-1"
      placeholder="请选择"
    />
    <XNativeSelect
      :options="services"
      label-key="title"
      value-key="id"
      v-model="serviceId"
      default="-1"
      placeholder="请选择"
      :disabled="groupId === -1"
    />
  </div>
</template>


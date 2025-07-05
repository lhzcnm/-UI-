<script setup lang="ts">
interface TheEmits {
  (e: 'change', value: number | string): void
}

defineEmits<TheEmits>()

const serviceStore = useServiceStore()

const serviceId = defineModel<number>({ default: 0 })
const groupId = ref(getGroupId(serviceId.value))

function getGroupId(serviceId: number) {
  const group = serviceStore.itemMap.get(serviceId)
  return group?.categoryId || -1
}

const options = computed(() => {
  const findIndex = serviceStore.details.findIndex(item =>
    item.categoryId === groupId.value
  )

  if (findIndex === -1) return []
  return serviceStore.details[findIndex].children
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <XNativeSelect
      v-model="groupId"
      :default="-1"
      :options="serviceStore.groups"
      @change="serviceId = 0"
      placeholder="请选择服务组"
      label-key="category"
      value-key="categoryId"
    />
    <XNativeSelect
      v-model="serviceId"
      :options="options"
      :disabled="groupId === -1"
      @change="$emit('change', $event)"
      placeholder="请选择服务"
      label-key="tmpTitle"
      value-key="packageId"
    />
  </div>
</template>

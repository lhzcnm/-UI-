<script setup lang="ts">
interface TheProps {
  service: any
  index: number
}

defineProps<TheProps>()
const serviceStore = useServiceStore()

function getLabel(id: number) {
  const servce = serviceStore.itemMap.get(id)
  return servce ? `${servce.packageId} - ${servce.packageTitle}` : '--'
}
</script>

<template>
  <div class="border rounded">
    <div class="flex justify-between p-3">
      <div class="flex-1 min-w-0 mr-2">
        <p class="text-sm truncate">{{ getLabel(service.packageId) }}</p>
        <p class="text-xs text-muted-foreground">
          原始点数：{{ service.price }}
        </p>
      </div>

      <XButton
        label="删除"
        icon="lucide:trash-2"
        size="sm" color="danger"
        @click="$emit('delete', service.id, index)"
      />
    </div>

    <div class="flex justify-between px-3 py-2 bg-muted border-t border-dashed">
      <div class="flex items-center">
        <span class="text-sm text-muted-foreground mr-2">点数:</span>
        <XInputNumber
          v-model="service.price"
          ui-root="bg-card"
          :step="0.01"
          :precision="2"
        />
      </div>
    </div>
  </div>
</template>

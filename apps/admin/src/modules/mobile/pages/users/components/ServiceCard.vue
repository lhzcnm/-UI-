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
  <button class="w-full text-left bg-card rounded-lg border overflow-hidden">
    <div class="flex justify-between p-3">
      <div class="flex-1 min-w-0 mr-2">
        <p class="text-sm truncate">{{ getLabel(service.packageId) }}</p>
        <p class="text-xs text-muted-foreground">
          原始点数：{{ service.price }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <XButton
          label="更新"
          icon="lucide:edit"
          size="sm"
          @click="$emit('update', service.packageId, index, service.price, service.freeCount)"
        />

        <XButton
          label="删除"
          icon="lucide:trash-2"
          size="sm" color="danger"
          @click="$emit('delete', service.id, index)"
        />
      </div>
    </div>

    <div class="flex justify-between px-3 py-2 bg-muted border-t border-dashed">
      <div class="flex-1">
        <label class="block text-sm text-muted-foreground mb-1">点数</label>
        <XInputNumber
          v-model="service.price"
          ui-root="bg-card"
          :step="0.01"
          :precision="2"
        />
      </div>

      <div v-if="service.freeCount >= 0">
        <label class="block text-sm text-muted-foreground mb-1">免费次数</label>
        <XInputNumber
          v-model="service.freeCount"
          ui-root="bg-card"
        />
      </div>
    </div>
  </button>
</template>

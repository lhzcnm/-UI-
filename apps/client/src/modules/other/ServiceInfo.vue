<script setup lang="ts">
import type { Service } from '@/api/services'

interface ServiceInfoProps {
  id: string
}

const props = defineProps<ServiceInfoProps>()
const serviceStore = useServiceStore()
const store = useSettingStore()

const service = ref<Service>()
const loading = ref(true)

onMounted(async () => {
  const serviceId = Number(props.id)
  await Promise.all([
    serviceStore.getServices(),
    store.getSettings(),
  ])

  const services = serviceStore.services
  service.value = services.get(serviceId)
  loading.value = false
})
</script>

<template>
  <div class="p-3 max-w-2xl mx-auto">
    <Fallback v-if="loading" />
    <div v-else-if="!service" class="text-center p-8 text-muted-foreground">
      未找到该服务信息
    </div>

    <template v-else>
      <div class="space-y-3 bg-card rounded-lg p-4 border">
        <div class="border-b border-dashed pb-1">
          <h1 class="text-lg"><span class="text-primary">#{{ service.id }}</span> {{ service.title }}</h1>

          <div class="my-2">
            <div class="flex items-center space-x-2">
              <span class="text-muted-foreground">服务价格:</span>
              <span class="font-semibold text-primary">¥{{ service.price }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-muted-foreground">预计耗时:</span>
              <span>{{ service.taken }}</span>
            </div>
          </div>
        </div>

        <div v-if="service.mustRead">
          <h2 class="text-lg font-semibold mb-2">服务说明</h2>
          <div
            class="tiptap bg-muted rounded-lg p-3"
            v-html="service.mustRead || '暂无服务说明'"
          />
        </div>

        <div class="flex justify-end">
          <XButton
            class="flex-row-reverse"
            label="提交订单" icon="lucide:arrow-right"
            @click="$router.push(`/submit/${id}`)"
          />
        </div>
      </div>

      <BaseFooter />
    </template>
  </div>
</template>

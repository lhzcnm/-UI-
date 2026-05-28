<script setup lang="ts">
import { serviceApi, type ServiceView } from '@/api/services'
import { Icon } from '@iconify/vue'

interface ServuceItemCardEmits {
  updateService: []
}

const { data } = defineProps<{ data: ServiceView }>()

const emits = defineEmits<ServuceItemCardEmits>()

const favoriteBool = ref<boolean>(true)

const { t } = useI18n()

async function favoriteClick(serviceId: number | undefined) {
  try {
    const res = await serviceApi.favorite(serviceId)
    favoriteBool.value = res.data.includes(data.id)
    emits('updateService')
  } catch {
  }
}

</script>

<template>
  <div>
    <div
      class="hover:text-sky-500  hover:rounded-md flex items-center justify-between space-x-2 w-full border-b p-1 border-dashed">

      <div class="space-x-1 flex w-3/5">
        <Icon icon="tabler:star-filled" class="text-sky-400 w-6" />
        <div class="flex-1 text-sm ">{{ data.id + " - " + data.title }}</div>
      </div>

      <div class="flex justify-end space-x-2 text-xs">
        <XTag color="primary" size="sm" class="flex items-center">{{ t('service.point') }}: {{ data.price }}</XTag>
        <XButton @click.stop="favoriteClick(data.id)" variant="soft" color="warning" size="sm">{{ favoriteBool ? '已收藏' :
          '收藏' }}</XButton>
      </div>
    </div>

  </div>
</template>

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

      <div class="flex space-x-1 justify-center items-center w-3/5">
        <Icon @click.stop="favoriteClick(data.id)" icon="tabler:star-filled" class="text-yellow-400 w-6" />
         <!-- <XButton icon="tabler:star-filled" @click.stop="favoriteClick(data.id)" variant="ghost" color="warning" size="sm">{{ favoriteBool ? t('query.favorite.favorited') :
          t('query.favorite.favorite') }}</XButton> -->
        <div class="flex-1 text-sm ">{{ data.id + " - " + data.title }}</div>
      </div>

      <div class="flex justify-end space-x-2 text-xs">
        <XTag color="success" size="sm" class="flex items-center">{{ data.price }}</XTag>
        <XTag color="primary" size="sm" class="flex items-center">{{ data.taken }}</XTag>
      </div>
    </div>

  </div>
</template>

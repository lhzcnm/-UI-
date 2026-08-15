<script setup lang="ts">
import { serviceApi, type ServiceView } from '@/api/services'
import { ua } from '@3un/utils'
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

interface ServuceItemCardEmits {
  updateService: []
}
interface ServuceItemCardProps {
  data: ServiceView
  favoriteIds?: number[]
}

const { data, favoriteIds } = defineProps<ServuceItemCardProps>()

const emits = defineEmits<ServuceItemCardEmits>()

const favoriteBool = ref<boolean>(true)

const localStore = useLocalStore()

async function favoriteClick(serviceId: number | undefined) {
  try {
    const res = await serviceApi.favorite(serviceId)
    favoriteBool.value = res.data.includes(data.id)
    emits('updateService')
  } catch {
  }
}

onMounted(() => {
  if (!favoriteIds) return
  favoriteBool.value = favoriteIds.includes(data.id)
})
</script>

<template>
  <a href="javascript:void(0)" :class="twJoin(
    'block p-3 bg-card space-y-1',
    'hover:border-primary hover:bg-border/60',
    'border border-border rounded-lg transition-colors')">
    <div class="flex items-center justify-between space-x-2">
      <h3 class="flex items-center space-x-2">
        <span class="font-bold" v-html="data.idHighlight || data.id" />
        <span v-if="data.isNew" :class="twJoin(
          'px-2 py-0.5 text-xs font-semibold text-white',
          'bg-gradient-to-b from-primary to-blue-600 rounded-full shadow-sm'
        )">
          {{ localStore.localData['home_New'] }} !
        </span>
      </h3>
      <div class="flex justify-end text-xs">
        <XTag color="danger">{{ localStore.localData['history_TableHeadPoints'] }}: {{ data.price }}</XTag>
        <XTag color="success" class="ml-1">{{ data.taken }}</XTag>
      </div>
    </div>

    <div class="flex justify-between">
      <div class="text-sm text-muted-foreground mt-1 text-ellipsis overflow-hidden" v-html="data.title" />

      <div @click.stop="favoriteClick(data.id)" class="flex items-center gap-1 cursor-pointer group">
        <button v-if="ua.isMobile"
          class="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 focus:outline-none border-none cursor-pointer shadow-sm"
          :class="favoriteBool ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 hover:shadow-yellow-200/50' : 'bg-gray-200 hover:bg-gray-300'">
          <Icon :icon="favoriteBool ? 'tabler:star-filled' : 'tabler:star'" class="size-4 transition-all duration-300"
            :class="favoriteBool ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'" />
        </button>

        <span class="text-sm font-medium transition-all duration-300"
          :class="favoriteBool ? 'text-yellow-500' : 'text-gray-400 group-hover:text-gray-600'">
          {{ favoriteBool ? localStore.localData['top_FavoritedYes'] : localStore.localData['top_Favorited'] }}
        </span>
      </div>
    </div>
  </a>
</template>

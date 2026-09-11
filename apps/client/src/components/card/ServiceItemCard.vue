<script setup lang="ts">
import { serviceApi, type ServiceView } from '@/api/services'
import { ua } from '@3un/utils'
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
  <a
    href="javascript:void(0)"
    :class="twJoin(
      'group relative flex flex-col justify-between block bg-white p-4 md:p-5 rounded-xl border border-slate-100',
      'shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
      'hover:shadow-[0_8px_24px_-6px_rgba(199,0,11,0.12)] hover:border-[#C7000B]/25 hover:-translate-y-0.5',
      'transition-all duration-250 cursor-pointer h-full'
    )"
  >
    <!-- 顶部：ID、新标签、积分与时间 -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="font-bold text-slate-800 text-[15px]" v-html="data.idHighlight || data.id" />
        <span
          v-if="data.isNew"
          class="shrink-0 px-1.5 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-[#C7000B] to-red-500 rounded-full"
        >
          {{ localStore.localData['home_New'] }}
        </span>
      </div>
      
      <!-- 胶囊标签 -->
      <div class="flex justify-end shrink-0 gap-1.5">
        <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#C7000B]/8 text-[#C7000B]">
          {{ localStore.localData['history_TableHeadPoints'] }}: {{ data.price }}
        </span>
        <span class="px-2 py-0.5 rounded-md text-[11px] font-medium bg-teal-50 text-teal-600">
          {{ data.taken }}
        </span>
      </div>
    </div>

    <!-- 底部：标题和收藏按钮 -->
    <div class="flex justify-between items-end mt-3 gap-3">
      <div
        class="text-[13px] text-slate-500 font-medium line-clamp-1 flex-1"
        v-html="data.title"
      />

      <XButton
        v-if="ua.isMobile"
        :icon="favoriteBool ? 'tabler:star-filled' : 'tabler:star'"
        @click.stop="favoriteClick(data.id)"
        :variant="favoriteBool ? 'soft' : 'outline'"
        :color="favoriteBool ? 'warning' : 'primary'" size="sm"
        class="shrink-0"
      >
        {{ 
          favoriteBool
            ? localStore.localData['top_FavoritedYes']
            : localStore.localData['top_Favorited']
        }}
      </XButton>
    </div>
  </a>
</template>
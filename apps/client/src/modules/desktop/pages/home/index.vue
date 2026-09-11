<script setup lang="ts">
import type { ServiceDetail } from '@/api/services'
import PickService from './components/PickService.vue'

import { xconfirm } from '@3un/utils'
import { useStorage } from '@vueuse/core'
import { getCommonList } from '@/utils'
// import Quote from './components/Quote.vue'

const store = useServiceStore()
const iStore = useSettingStore()
// await store.getServices()

const router = useRouter()

const defaultGroup = { id: 0, title: '', children: [] }
const current = ref<ServiceDetail>(defaultGroup)
const visible = ref(false)

const { popupAnnc, popupAnncEn, enablePopupAnnc } = iStore.settings
const anncVisible = useStorage('annc-visible', enablePopupAnnc, sessionStorage)
const { locale } = useI18n()
const localStore = useLocalStore()

const searchKeyword = ref('')

const confirmText = computed(() => {
  return locale.value === 'zh'
    ? popupAnnc
    : (popupAnncEn && popupAnncEn.trim()) || popupAnnc
})

onMounted(async () => {
  if (!anncVisible.value) return
  const result = await xconfirm({
    title: localStore.localData['home_Announcement'],
    text: confirmText.value,
    confirmText: localStore.localData['home_Confirm'],
    cancelText: undefined,
  })

  if (result) {
    anncVisible.value = false
  }
})

const commonList = getCommonList(store.services)

const bulletinBoardText = computed(() => {
  return locale.value === 'zh'
    ? iStore.settings.scrollingAnnc
    : iStore.settings.scrollingAnncEn
      ? iStore.settings.scrollingAnncEn
      : iStore.settings.scrollingAnnc
})

// 过滤后的服务分组（支持搜索）
const filteredGroups = computed(() => {
  if (!searchKeyword.value.trim()) return store.details

  const keyword = searchKeyword.value.trim().toLowerCase()
  return store.details
    .map((group) => {
      const matchedChildren = group.children.filter((item: any) => {
        const title = (item.title || '').toLowerCase()
        const id = String(item.id || '')
        return title.includes(keyword) || id.includes(keyword)
      })
      if (matchedChildren.length === 0 && !group.title.toLowerCase().includes(keyword)) {
        return null
      }
      return {
        ...group,
        children: matchedChildren.length > 0 ? matchedChildren : group.children,
        _matchedCount: matchedChildren.length,
      }
    })
    .filter(Boolean) as ServiceDetail[]
})

function openGroupDialog(group: ServiceDetail) {
  current.value = group
  visible.value = true
}

function handleServiceItemClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const element = target.closest('[data-id]')

  if (!element) return

  const dataId = element.getAttribute('data-id')
  const id = parseInt(dataId || '0')

  router.push(`/submit/${id}`)
}

function clearSearch() {
  searchKeyword.value = ''
}
</script>

<template>
  <div class="p-5 md:p-7 lg:p-9 bg-slate-50/70 min-h-screen text-slate-800">
    
    <!-- 顶部公告（更克制） -->
    <XBulletinBoard 
      v-if="iStore.settings.enableScrollingAnnc" 
      class="mb-6 rounded-xl shadow-sm border border-slate-100/80 overflow-hidden" 
      :text="bulletinBoardText"
      :style="{ '--bg': '#ffffff' }" 
    />

    <!-- 顶部工具区：搜索 + 快速入口提示 -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="relative flex-1 max-w-xl">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="w-4.5 h-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="searchKeyword"
          type="text"
          :placeholder="localStore.localData['home_SearchServices'] || '搜索服务名称或编号...'"
          class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C7000B]/20 focus:border-[#C7000B]/50 transition-all shadow-sm"
        />
        <button
          v-if="searchKeyword"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="text-xs text-slate-400 hidden sm:block">
        共 {{ store.details?.length || 0 }} 个服务分类
      </div>
    </div>

    <!-- 常用服务（提升优先级，放到最前面） -->
    <section v-if="commonList.length && !searchKeyword" class="mb-10">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <span class="w-1.5 h-5 bg-[#C7000B] rounded-full"></span>
          {{ localStore.localData['home_Services'] || '常用服务' }}
        </h2>
        <span class="text-xs text-slate-400 font-medium">
          {{ commonList.length }} 项
        </span>
      </div>
      
      <div 
        class="grid gap-4 md:gap-5 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))]" 
        @click="handleServiceItemClick"
      >
        <ServiceItemCard 
          v-for="item in commonList" 
          :key="item.id" 
          :data="item" 
          :data-id="item.id" 
          class="bg-white rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-6px_rgba(199,0,11,0.12)] hover:border-[#C7000B]/25 hover:-translate-y-0.5 transition-all duration-250 cursor-pointer"
        />
      </div>
    </section>

    <!-- 全部服务分类 -->
    <section>
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg md:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <span class="w-1.5 h-5 bg-slate-300 rounded-full"></span>
          {{ searchKeyword ? '搜索结果' : '全部服务' }}
        </h2>
        <span v-if="searchKeyword" class="text-xs text-slate-400">
          找到 {{ filteredGroups.length }} 个相关分类
        </span>
      </div>

      <!-- 无搜索结果提示 -->
      <div 
        v-if="searchKeyword && filteredGroups.length === 0" 
        class="py-16 text-center"
      >
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
          <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p class="text-slate-500 text-sm">没有找到匹配的服务</p>
        <button 
          @click="clearSearch"
          class="mt-3 text-sm text-[#C7000B] hover:underline font-medium"
        >
          清除搜索
        </button>
      </div>

      <!-- 服务分组网格 -->
      <div 
        v-else
        class="grid gap-4 md:gap-5 lg:gap-6 grid-cols-[repeat(auto-fill,minmax(300px,_1fr))]"
      >
        <ServiceGroupCard 
          v-for="group in filteredGroups" 
          :key="group.id" 
          :group="group" 
          class="bg-white rounded-2xl border border-slate-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_28px_-8px_rgba(199,0,11,0.12)] hover:-translate-y-0.5 hover:border-[#C7000B]/20 transition-all duration-250 cursor-pointer overflow-hidden"
          @click="openGroupDialog(group)" 
        />
      </div>
    </section>

    <PickService v-model="visible" :group="current" />
  </div>
</template>
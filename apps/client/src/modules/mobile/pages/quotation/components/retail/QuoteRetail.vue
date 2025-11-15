<script setup lang="ts">
import { Icon } from '@iconify/vue'
import HuaQIangBei from './HuaQIangBei.vue'
import HongKong from './HongKong.vue'
import SamSung from './SamSung.vue'
import FeiYang from './FeiYang.vue'
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../utils/store'
const { t } = useI18n()
const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!

// 标签页数据
const tabs = ['quote.Tabs.Tab1', 'quote.Tabs.Tab2', 'quote.Tabs.Tab3', 'quote.Tabs.Tab4']

// 切换标签时重置筛选条件
watch(
  () => store.activeTab,
  () => {
    store.selectedTypes = []
    store.selectedSizes = []
    store.selectedColors = []
    store.selectedAppearances = []
    store.selectedStatuses = []
  }
)

onMounted(() => {
  store.activeTab = 0
})
</script>

<template>
  <div class="w-full h-full flex flex-col transition-colors duration-300">
    <!-- 顶部导航栏 -->
    <div
      class="relative flex items-center border-b border-gray-300 dark:border-border
             bg-gradient-to-br from-white/90 to-gray-100/50 dark:from-black/30 dark:to-black/50 backdrop-blur-sm shadow-sm py-2 px-2 transition-all duration-300"
    >
      <!-- Tabs 滚动区 -->
      <div
        class="flex space-x-2 overflow-x-auto flex-1 pr-20
               [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          @click="store.activeTab = index"
          class="px-4 py-2 flex justify-center items-center cursor-pointer text-sm font-medium rounded-lg
                 transition-all duration-300 whitespace-nowrap select-none"
          :class="store.activeTab === index
            ? 'text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40 font-semibold shadow-inner'
            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800/70'"
        >
          {{ t(tab) }}
        </div>
      </div>

      <!-- 筛选按钮 -->
      <button
        @click="store.OpenSearch = true"
        class="absolute right-2 flex items-center px-3 py-2 text-sm font-medium
               bg-blue-50 text-blue-600 rounded-lg
               hover:bg-blue-100 hover:text-blue-700
               dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white
               transition-all duration-300"
      >
        <Icon icon="mingcute:dots-fill" class="mr-1 text-lg" />
        {{ t('quote.Filter') }}
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="flex-1 overflow-auto pb-14  transition-colors duration-300">
      <HongKong v-if="store.activeTab == 0" />
      <FeiYang v-if="store.activeTab == 1" />
      <HuaQIangBei v-if="store.activeTab == 2" />
      <SamSung v-if="store.activeTab == 3" />
    </div>
  </div>
</template>

<style scoped>
button {
  user-select: none;
}
</style>
 
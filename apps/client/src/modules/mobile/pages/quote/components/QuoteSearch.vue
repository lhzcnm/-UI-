<script setup lang="ts">
import { Icon } from '@iconify/vue'
import loading from './loading.vue'
import { priceSearch, serachType } from '../api/quote'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const store = inject<quoteType>(QUOTE_STORE)!
const isLoading = ref(true)
const isSelect = ref(true)

watch(() => store.search,() => {
  searchPrice()
},{ deep:true })

// 搜索类型数据
async function SearchType() {
  try {
    isLoading.value = true
    const res = await serachType()
    store.searchType = res
  } catch (error) {
    console.error('获取搜索类型失败：', error)
  } finally {
    isLoading.value = false
  }
}

// 搜索价格数据
async function searchPrice() {
  try {
    isLoading.value = true
    const res = await priceSearch(store.search)
    store.searchData = res
  } catch (error) {
    console.error('搜索价格失败：', error)
  } finally {
    isLoading.value = false
  }
}

//进入清空搜索栏
function resetSearch() {
  Object.assign(store.search, {
    model: '',
    big: '',
    status: ''
  })
}

SearchType()
searchPrice()

onMounted(resetSearch)
</script>

<template>
  <loading v-if="isLoading"/>
  <div class="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">

    <!-- 标题栏 -->
    <div
      class="relative h-12 flex items-center justify-center bg-gradient-to-r from-sky-200/60 via-purple-200/50 to-pink-200/60 dark:from-sky-900/40 dark:via-purple-900/40 dark:to-pink-900/40 
             backdrop-blur-md shadow-md border-b border-white/20 dark:border-gray-700 select-none"
    >
      <Icon
        icon="weui:back-filled"
        class="absolute left-3 size-5 text-gray-600 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-300 cursor-pointer"
        @click="store.IsSearchQuote = false"
      />
      <div
        class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md"
      >
        搜索功能
      </div>
    </div>

    <!-- 搜索栏 -->
    <section
      class="relative w-full max-w-3xl mx-auto mt-3 space-y-4 p-4 bg-white/70 dark:bg-gray-800/60 
             border border-white/40 dark:border-gray-700 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300"
    >
      <!-- 型号 -->
      <div class="flex flex-col">
        <label class="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">选择型号</label>
        <select
          v-model="store.search.model"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-medium transition-all duration-200"
        >
          <option v-for="item in store.searchType?.models" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <!-- 内存 -->
      <div v-show="isSelect" class="flex flex-col">
        <label class="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">硬盘容量</label>
        <select
          v-model="store.search.big"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-medium transition-all duration-200"
        >
          <option v-for="item in store.searchType?.bigs" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <!-- 外观 -->
      <div v-show="isSelect" class="flex flex-col">
        <label class="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">外观/磨损</label>
        <select
          v-model="store.search.status"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-medium transition-all duration-200"
        >
          <option v-for="item in store.searchType?.statuses" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <Icon @click="isSelect = !isSelect
      " :icon="isSelect?  'lucide:circle-chevron-up' : 'lucide:circle-chevron-down' " class="size-6 bg-gray-400 absolute -top-2 right-2 border rounded-full text-white"/>
    </section>

    <!-- 手机表单列表 -->
    <section
      class="flex-1 px-4 py-4 mt-2 space-y-4 overflow-y-auto scroll-smooth 
             [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="(items, index) in store.searchData"
        :key="index"
        class="space-y-3 p-2 bg-white/80 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      >
        <!-- 标题 + 操作 -->
        <div class="flex justify-between items-center px-3 pt-3">
          <div class="flex items-center space-x-2 text-gray-700 dark:text-gray-200 font-semibold">
            <Icon icon="clarity:mobile-phone-solid" class="text-lg text-sky-500 dark:text-sky-400" />
            <span class="text-sm">{{ items.iphoneModel }}</span>
          </div>

          <!-- <div class="flex space-x-2 items-center">
            <button
              class="bg-gradient-to-br from-blue-500/80 from-30% to-blue-500/20 to-80% w-16 h-8 rounded-md shadow hover:scale-105 transition-all duration-300 text-white text-sm font-medium"
            >
              +100
            </button>
            <button
              class="bg-gradient-to-br from-red-500/80 from-30% to-red-500/20 to-80% w-16 h-8 rounded-md shadow hover:scale-105 transition-all duration-300 text-white text-sm font-medium"
            >
              -100
            </button>
            <div class="flex items-center space-x-1 text-gray-700 dark:text-gray-300 text-sm">
              <Icon icon="formkit:radio" class="text-base" />
              <span>自定义</span>
            </div>
          </div> -->
        </div>

        <!-- 列表内容 -->
        <div v-for="(item, index2) in items.phoneStatusList" :key="index2" class="rounded-xl overflow-hidden">
          <div
            class="w-full text-center bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-200 font-semibold py-1"
          >
            {{ item.big }}
          </div>

          <div
            v-for="(itm, i3) in item.phoneStatus"
            :key="i3"
            class="flex justify-between items-center p-2 bg-white/70 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
          >
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">{{ itm.status }}</div>
            <div class="flex space-x-2">
              <div class="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs px-2 py-0.5 rounded">
                {{ itm.price || '/' }}
              </div>
              <div class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded">
                标记优势
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

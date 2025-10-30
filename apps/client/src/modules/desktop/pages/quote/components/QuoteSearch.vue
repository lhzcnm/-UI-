<script setup lang="ts">
import { Icon } from '@iconify/vue'
import loading from './loading.vue'
import { newPriceSearch, newSearchType, priceSearch, serachType } from '../api/quote'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const store = inject<quoteType>(QUOTE_STORE)!
const { t } = useI18n()
const searchTop = ref([`${t('quote.SearchFunction.UsedPhone')}`,`${t('quote.SearchFunction.NewPhone')}`])
const newModelTableType = [`${t('quote.ImageTableType.Color')}`, `${t('quote.ImageTableType.China')}`, `${t('quote.ImageTableType.England')}` ]
const isLoading = ref(true)
const isSelect = ref(false)
const activeIndex = ref(0)

watch(() => store.search,() => {
  searchPrice()
},{ deep:true })
watch(() => store.newSearch,() => {
  NewSearchPrice()
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

// 新机搜索类型数据
async function NewSearchType() {
  try {
  isLoading.value = true
  const res = await newSearchType()
  store.newSearchType = res
  } catch (error) {
    console.error('获取搜索类型失败：', error)
  } finally {
    isLoading.value = false
  }
}
// 搜索新机价格
async function NewSearchPrice() {
  try {
    isLoading.value = true
    const res = await newPriceSearch(store.newSearch)
    store.newSearchData = res
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
  Object.assign(store.newSearch, {
    model: '',
    big: '',
    status: ''
  })
}

SearchType()
searchPrice()
NewSearchType()
NewSearchPrice()
onMounted(resetSearch)
</script>

<template>
  <loading v-if="isLoading"/>
  <div class="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-black dark:via-black dark:to-black0 transition-colors duration-500">

    <!-- 标题栏 -->
    <div
      class="relative h-12 flex items-center justify-center backdrop-blur-md shadow-md border-b border-white/20 dark:border-gray-700 select-none"
    >
      <Icon
        icon="charm:circle-minus"
        class="absolute right-3 size-6 text-gray-600 hover:text-sky-600 transition-colors duration-300 cursor-pointer"
        @click="store.IsSearchQuote = false"
      />
      <div
        class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md"
      >
        {{ t('quote.SearchFunction.SearchFunction') }}
      </div>
    </div>

    <!-- 顶部状态选择 -->
    <div class="relative flex border-b  bg-white/70 dark:bg-black  backdrop-blur-md">
      <div v-for="(item,index) in searchTop"
           @click="activeIndex = index"
           :class="activeIndex === index ? 'flex-1 text-center font-bold text-gray-800 dark:text-white border-b-2 border-sky-500 transition-all duration-300 py-2 cursor-pointer' : 'flex-1 text-center text-gray-300 py-2 cursor-pointer'">
        {{ item }}
      </div>
    </div>

    <!-- 搜索栏 -->
    <section
      v-show="activeIndex == 0"
      class="relative w-full max-w-3xl mx-auto  space-y-4 p-4 bg-white/70 dark:bg-black 
             border border-white/40 dark:border-black rounded-b-2xl shadow dark:shadow-gray-500 backdrop-blur-md transition-all duration-300"
    >
      <!-- 型号 -->
      <div class="flex flex-col">
        <label class="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">{{ t('quote.SearchFunction.SelectModel') }}</label>
        <select
          v-model="store.search.model"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-medium transition-all duration-200"
        >
          <option v-for="item in store.searchType?.models" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <!-- 内存 -->
      <div v-show="isSelect" class="flex flex-col">
        <label class="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">{{ t('quote.ImageTableType.Capacity') }}</label>
        <select
          v-model="store.search.big"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-medium transition-all duration-200"
        >
          <option v-for="item in store.searchType?.bigs" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <!-- 外观 -->
      <div v-show="isSelect" class="flex flex-col">
        <label class="text-gray-500 dark:text-gray-300 text-sm font-medium mb-1">{{ t('quote.SearchFunction.Appearance') }}</label>
        <select
          v-model="store.search.status"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-medium transition-all duration-200"
        >
          <option v-for="item in store.searchType?.statuses" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <Icon @click="isSelect = !isSelect
      " :icon="isSelect?  'lucide:circle-chevron-up' : 'lucide:circle-chevron-down' " class="size-6 bg-gray-400 absolute -top-2 right-2 border rounded-full text-white"/>
    </section>

    <!-- 新机搜索栏 -->
    <section
      v-show="activeIndex == 1"
      class="relative w-full max-w-3xl mx-auto  space-y-4 p-4 bg-white/70 dark:bg-black
             border border-white/40 dark:border-black rounded-b-2xl shadow-sm dark:shadow-gray-500 backdrop-blur-md transition-all duration-300"
    >
      <!-- 型号 -->
      <div class="flex flex-col">
        <label class="text-gray-500 dark:text-white text-sm font-medium mb-1">{{ t('quote.SearchFunction.SelectModel') }}</label>
        <select
          v-model="store.newSearch.model"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-medium transition-all duration-200"
        >
          <option v-for="item in store.newSearchType?.models" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <!-- 内存 -->
      <div v-show="isSelect" class="flex flex-col">
        <label class="text-gray-500 dark:text-white text-sm font-medium mb-1">{{ t('quote.ImageTableType.Capacity') }}</label>
        <select
          v-model="store.newSearch.big"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-black text-gray-800 dark:text-white font-medium transition-all duration-200"
        >
          <option v-for="item in store.newSearchType?.bigs" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <!-- 外观 -->
      <div v-show="isSelect" class="flex flex-col">
        <label class="text-gray-500 dark:text-white text-sm font-medium mb-1">{{ t('quote.SearchFunction.Appearance') }}</label>
        <select
          v-model="store.newSearch.status"
          class="p-2 rounded-xl border border-gray-300 dark:border-gray-500 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 bg-white dark:bg-black text-gray-800 dark:text-gray-200 font-medium transition-all duration-200"
        >
          <option v-for="item in store.newSearchType?.statuses" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>

      <Icon @click="isSelect = !isSelect
      " :icon="isSelect?  'lucide:circle-chevron-up' : 'lucide:circle-chevron-down' " class="size-6 bg-gray-400 absolute -top-2 right-2 border rounded-full text-white"/>
    </section>

    <!-- 二手手机表单 -->
    <section
      v-show="activeIndex == 0"
      class="flex-1 px-4 py-4 mt-2 space-y-4 overflow-y-auto scroll-smooth 
             [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="(items, index) in store.searchData"
        :key="index"
        class="space-y-3 p-2 bg-white/80 dark:bg-black backdrop-blur-md rounded-2xl shadow-lg border border-white/30 dark:border-gray-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
      >
        <!-- 标题 -->
        <div class="flex justify-between items-center px-3 pt-3">
          <div class="flex items-center space-x-2 text-gray-700 dark:text-gray-200 ">
            <Icon icon="clarity:mobile-phone-solid" class="text-lg text-sky-500 dark:text-sky-400" />
            <span class="text-sm">{{ items.iphoneModel }}</span>
          </div>
        </div>
      
        <!-- 列表内容 -->
        <div v-for="(item, index2) in items.phoneStatusList" :key="index2" class="rounded-xl border border-gray-200 dark:border-gray-500 overflow-hidden mb-2">

          <!-- 容量标题 -->
          <div
            class="w-full text-center bg-gray-50 dark:bg-black text-gray-700 dark:text-white py-1 border-b border-gray-200 dark:border-gray-600"
          >
            {{ item.big }}
          </div>

          <div class="overflow-x-auto max-h-64 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <!-- 表格 -->
            <div class="grid" :style="{ gridTemplateColumns: `repeat(${item.phoneStatus.length}, minmax(80px, 1fr))` }">
              <div
                v-for="(itm, i3) in item.phoneStatus"
                :key="'cell-' + i3"
                class="flex flex-col border-r last:border-r-0 border-gray-200 dark:border-gray-500"
              >
                <!-- 状态 -->
                <div class="h-12 flex items-center justify-center p-2 text-center text-xs text-gray-700 dark:text-white bg-gray-50 dark:bg-black">
                  {{ itm.status }}
                </div>
                <!-- 价格 -->
                <div class="h-12 flex items-center justify-center p-2 text-center text-sm text-gray-600 dark:text-white bg-white/80 dark:bg-black border-t border-gray-100 dark:border-gray-500">
                  {{ itm.price || '/' }}
                </div>
              </div>
            </div>
          </div>

        </div>
      
      </div>
    </section>

    <!-- 新机手机表单 -->
    <section
      v-show="activeIndex == 1"
      class="flex-1 px-4 py-4 space-y-4 overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="(items, index) in store.newSearchData"
        :key="index"
        class="space-y-3 bg-white/80 dark:bg-black border border-gray-500 backdrop-blur-md rounded-2xl shadow-md p-3"
      >
        <!-- 顶部机型信息 -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2 text-gray-700 dark:text-white font-medium">
            <Icon icon="clarity:mobile-phone-solid" class="text-lg" />
            <span class="text-sm">{{ items.iphoneModel }}</span>
          </div>
        </div>
      
        <!-- 存储容量分组 -->
        <div
          v-for="(item, index2) in items.phoneStatusList"
          :key="index2"
          class="rounded-xl shadow-md overflow-hidden border dark:border-gray-500"
        >
          <!-- 容量标题 -->
          <div class="w-full text-center bg-gray-100 dark:bg-black text-gray-700 dark:text-white font-medium py-1">
            {{ item.big }}
          </div>
        
          <!-- 表头 -->
          <div
            class="grid grid-cols-[1fr,repeat(2,1fr)] bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-white font-medium text-xs border-b border-gray-200 dark:border-gray-500"
          >
            <div class="p-2 text-center" v-for="im in newModelTableType">{{ im }}</div>
          </div>
        
          <!-- 数据行 -->
          <div
            v-for="(itm, index3) in item.phoneStatus"
            :key="index3"
            class="grid grid-cols-[1fr,repeat(2,1fr)] items-center bg-white/80 dark:bg-black text-gray-700 dark:text-white text-xs border-b border-gray-100 dark:border-gray-500"
          >
            <div class="p-2 text-center">{{ itm.status }}</div>
        
            <!-- 如果 itm.price 是数组，则按顺序渲染 -->
            <div
              v-for="(im, i) in itm.price"
              :key="i"
              class="p-2 text-center border-l border-gray-200 dark:border-gray-500"
            >
              {{ im || '/' }}
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

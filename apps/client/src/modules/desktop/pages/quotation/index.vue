<script setup lang="ts">
import { reactive, provide } from 'vue'
import { Icon } from '@iconify/vue'
import { quoteApi } from './api/http'

// 组件引入
import QuoteFreeDialog from './components/QuoteFreeDialog.vue'
import QuoteHome from './components/home/QuoteHome.vue'
import QuoteFillter from './components/fillter/QuoteFillter.vue'
import QuoteRetail from './components/retail/QuoteRetail.vue'
import QuoteImageDialog from './components/imageQuote/QuoteImageDialog.vue'
import HongKong from './components/imageQuote/HongKong.vue'
import Huaqiangbei from './components/imageQuote/Huaqiangbei.vue'
import FeiYang from './components/imageQuote/FeiYang.vue'
import SamSung from './components/imageQuote/SamSung.vue'
import FillterDrawer from './components/retail/drawer/FillterDrawer.vue'
import FillterData from './components/retail/drawer/FillterData.vue'
import LoadingDialog from './components/LoadingDialog.vue'
import FillterImageDialog from './components/fillter/image/FillterDialog.vue'
import HuaqiangbeiUpdate from './components/fillter/image/Huaqiangbei.vue'
import FeiYangUpdate from './components/fillter/image/FeiYang.vue'
import HongKongUpdate from './components/fillter/image/HongKong.vue'
import SamSungUpdate from './components/fillter/image/SamSung.vue'

import  { type QUOTE_STORE_TYPE,QUOTE_STORE } from './utils/store'
import router from '@/router'

const mode = import.meta.env.VITE_APP_MODE

const { t } = useI18n()
// store 反应式数据
const store = reactive<QUOTE_STORE_TYPE>({
  priceIcon: 'HK$',
  priceType: 3,
  watermark: '陆深三和',
  colorIndex: 0,
  loading: false,
  pageShow: 'home', // 控制当前显示的页面
  updateIndex: 0, // 更新索引
  IsCustomer: false, // 客服弹窗
  ImageDialogID: 0, // 图片弹窗标识
  IsUpdateImageDialog: false, // 更新图片弹窗
  IsImageDialog: false, // 显示图片弹窗
  OpenSearch: false, // 控制搜索框打开
  activeTab: 0, // 活动标签页
  HuaQiangBeiData: [], // 华强北数据
  FeiYangData: [], // 飞扬数据
  HongKongNewData: [], // 香港新机数据
  SanSungData: [], // 三星数据
  UpdateHuaQiangBeiData: [], // 更新华强北数据
  UpdateFeiYangData: [], // 更新飞扬数据
  UpdateHongKongNewData: [], // 更新香港数据
  UpdateSanSungData: [], // 更新三星数据
  selectedTypes: [],
  selectedSizes: [],
  selectedStatuses: [],
  selectedAppearances: [],
  selectedColors: [],
})
const IsReturn = ref(false)

const iStore = useSettingStore()

function PageShow(item: string) {
  if(item !== 'return'){
    store.pageShow = item
  }
  else{
    IsReturn.value = true
  }
}

const onCancel = () => {
  store.pageShow = 'home'
  IsReturn.value = false
}

const onConfirm = () => {
  router.back()
}

// API 获取数据
async function getHQBData() {
  try {
    const res = await quoteApi.getHuaQiangBei()
    store.HuaQiangBeiData = res
    
  } catch (error) {
    console.error('获取华强北数据失败：', error)
  } finally {
  }
}

async function getFYData() {
  try {
    const res = await quoteApi.GetFeiYang()
    store.FeiYangData = res
  } catch (error) {
    console.error('获取飞扬数据失败：', error)
  } finally {
  }
}

watch(
  () => store.priceType,
  () => {
    getHKNewData()
    getSXData()

    const priceIcons: Record<number, string> = {
      1: '￥',
      2: '$',
      3: 'HK$',
    }

    store.priceIcon = priceIcons[store.priceType] || ''
  }
)
async function getHKNewData() {
  try {
    const res = await quoteApi.GetHongKongNew({priceType: store.priceType})
    store.HongKongNewData = res

  } catch (error) {
    console.error('获取香港新机数据失败：', error)
  } finally {
  }
}

async function getSXData() {
  try {
    const res = await quoteApi.GetSanXin({priceType: store.priceType})
    store.SanSungData = res
    console.log(res)

  } catch (error) {
    console.error('获取三星数据失败：', error)
  } finally {
  }
}

await Promise.all([
  iStore.getSettings(),
  getHQBData(),
  getFYData(),
  getHKNewData(),
  getSXData(),
])

// 初始数据获取
onMounted(() => {{

}})

// 提供全局 store
provide(QUOTE_STORE, store)
</script>

<template>
  <div class="overflow-hidden h-screen bg-gradient-to-br from-blue-300/20 from-30% to-white to-60%">
    <div class="flex flex-col w-full mx-auto h-screen overflow-hidden">
      <!-- 底部导航栏 -->
      <section class="w-1/2 h-16 fixed bottom-0 right-1/2 translate-x-1/2 z-30 flex justify-around items-center 
               backdrop-blur-md bg-white/70 dark:bg-black/40 
               border-t border-white/20 dark:border-gray-700/40 
               shadow rounded-t-2xl
               transition-all duration-300">
        <div
          v-for="item in [
            { key: 'home', icon: 'lucide:house', label: t('quote.Tab.Home'), color: 'from-sky-400 to-blue-500' },
            { key: 'retail', icon: 'lucide:book-open-text', label: t('quote.Tab.Retail'), color: 'from-pink-400 to-purple-500' },
            { key: 'fillter', icon: 'iconoir:edit-pencil', label: t('quote.Tab.Fillter'), color: 'from-amber-400 to-orange-500' },
            { key: 'return', icon: 'iconoir:emoji-talking-angry', label: t('quote.Tab.Return'), color: 'from-red-400 to-red-500' }
          ]"
          :key="item.key"
          @click="PageShow(item.key)"
          class="group flex flex-col items-center justify-center cursor-pointer select-none 
                 transition-all duration-300 ease-out">
          <div
            class="relative flex items-center justify-center size-8 rounded-full
                   transition-all duration-300 ease-out 
                   group-hover:scale-110 group-hover:drop-shadow-md"
            :class="[store.pageShow === item.key 
              ? `bg-gradient-to-br ${item.color} text-white shadow-md animate-bounce` 
              : 'bg-transparent text-gray-500 dark:text-gray-300 group-hover:text-sky-400']">
            <Icon :icon="item.icon" class="size-5" />
          </div>
        
          <div
            class="mt-1 text-[12px] font-medium dark:text-white transition-all duration-300"
            :class="store.pageShow === item.key 
              ? 'text-transparent dark:text-sky-400 bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 drop-shadow-sm'
              : 'text-gray-500 dark:text-gray-400 group-hover:text-sky-400'">
            {{ item.label }}
          </div>
        </div>
      </section>

      <!-- 动态内容区，根据页面切换显示不同内容 -->
      <QuoteHome v-if="store.pageShow === 'home'" />
      <QuoteFillter v-if="store.pageShow === 'fillter'" />
      <QuoteRetail v-if="store.pageShow === 'retail'" />
    
      <!-- 热门客服二维码弹窗 -->
      <XDialog v-model="store.IsCustomer">
        <img :src="`/${mode}/customer_service_qrcode.jpg`" alt="" class="rounded-xl">
      </XDialog>
    
      <!-- 报价单图片弹窗 -->
      <QuoteImageDialog :is-dialog="store.IsImageDialog">
        <Huaqiangbei v-if="store.ImageDialogID === 1" />
        <FeiYang v-if="store.ImageDialogID === 2" />
        <HongKong v-if="store.ImageDialogID === 3" />
        <SamSung v-if="store.ImageDialogID === 4" />
      </QuoteImageDialog>

      <!-- 更新报价图片弹窗 -->
      <FillterImageDialog :is-dialog="store.IsUpdateImageDialog">
        <HuaqiangbeiUpdate v-if="store.updateIndex === 0" />
        <FeiYangUpdate v-if="store.updateIndex === 1" />
        <HongKongUpdate v-if="store.updateIndex === 2" />
        <SamSungUpdate v-if="store.updateIndex === 3" />
      </FillterImageDialog>
    </div>
    
    <!-- 筛选面板 -->
    <FillterDrawer v-model="store.OpenSearch">
      <FillterData />
    </FillterDrawer>
    
    <!-- 加载动画 -->
    <LoadingDialog v-if="store.loading" />

    <QuoteFreeDialog
      v-model="IsReturn"
      :title="t('quote.confirmLeave')"
      :message="t('quote.message')"
      @confirm="onConfirm()"
      @cancel="onCancel()"
    />

  </div>
</template>

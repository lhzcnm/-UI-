<script setup lang="ts">
import QuoteFeature from './components/QuoteFeature.vue'
import QuoteFilter from './components/QuoteFilter.vue'
import QuoteFilterSheet from './components/QuoteFilterSheet.vue'
import QuoteImage from './components/QuoteImage.vue'
import QuoteImageDialog from './components/QuoteImageDialog.vue'
import QuotepopularModel from './components/QuotePopularModels.vue'
import QuoteRealTime from './components/QuoteRealTime.vue'
import QuotePopular from './components/QuotePopular.vue'
import  { type quoteType, QUOTE_STORE } from './utils/store'
import { HotModel } from './api/quote'
import QuoteSearch from './components/QuoteSearch.vue'
import router from '@/router'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
const store = reactive<quoteType>({
  IsCustomer: false     ,
  IsCreateQuote: false   ,
  IsImageDialog: false   ,
  IsPopularModels: false,
  IsTailored: false,
  IsTailoredModules: false,
  IsSearchQuote: false,

  isImageAdd: false,

  phoneStatusArr:  [`${t('quote.RealQuote.HongKong')}`,`${t('quote.RealQuote.FarVision')}`,`${t('quote.RealQuote.Flying')}`],

  hotModelType: [],
  hotModel: [],

  quoteWatermark: '',
  quoteColorIndex: 0,
  quoteImagePageBtnIsOpen: false,
  quotationImageType: 0,
  quotationImageData: [],
  quoteNewImageData: [],

  params: {
    type: 1,
    iPhoneModel: [],
    modelId: undefined,
    add: 0,
    reduce: 0 
  },
  newParams:{
    iPhoneModel: [],
    modelId: undefined,
    add: 0,
    reduce: 0
  },
  quoteFilterData: [],
  quoteFilterDataName: [],
  newQuoteFilterData: [],
  newQuoteFilterDataName: [],

  searchData: [],
  searchType: {
    models: [],
    bigs: [],
    statuses: []
  },
  search:{
    big:'',
    model:'',
    status: ''
  },
  newSearchData: [],
  newSearchType: {
    models: [],
    bigs: [],
    statuses: []
  },
  newSearch:{
    big:'',
    model:'',
    status: ''
  },
})

//获取热门型号的数据
async function GetHotModelData() {
  try {
    const res = await HotModel()
    store.hotModelType = res
    store.hotModel = res[1]
    // console.log(res)
    
  } catch (error) {
    console.error('获取热门机型失败：', error)
  }
}

GetHotModelData()

provide(QUOTE_STORE, store)
</script>

<template>
  <div class="h-screen p-2 bg-gradient-to-br from-sky-200/30 dark:from-sky-900/30 from-0% to-blue-500/20 to-80% shadow-sky-200/10 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <!-- 实时报价单 -->
    <QuoteRealTime/>
    <!-- 高级功能 -->
    <QuoteFeature/>
    <!-- 热门机型 -->
    <div class="w-2/3 mx-auto">
      <QuotepopularModel/>
    </div>
    <button
      @click="router.back()"
      class="fixed top-4 right-4 z-50 p-2 bg-white/90 text-gray-800 hover:bg-white/100 hover:text-gray-900 shadow-md rounded-full transition-all duration-300 flex items-center justify-center"
    >
    <Icon icon="ci:chevron-left" class="size-5"/>
      {{ t('quote.QuoteButton.Return') }}
    </button>

  </div>

  <!-- 实时报价单弹窗 -->
  <QuoteImageDialog v-model:isDialog="store.IsImageDialog">
    <QuoteImage/>
  </QuoteImageDialog>

  <!-- 个性化报价单弹窗 -->
  <QuoteImageDialog v-model:isDialog="store.IsCreateQuote">
    <QuoteFilter/>
  </QuoteImageDialog>

  <!-- 个性化设置弹窗 -->
  <QuoteImageDialog v-model:isDialog="store.IsTailored">
    <QuoteFilterSheet/>
  </QuoteImageDialog>

  <!-- 个性化设置弹窗 -->
  <QuoteImageDialog v-model:isDialog="store.IsPopularModels">
    <QuotePopular/>
  </QuoteImageDialog>

  <!-- 搜索功能 -->
  <QuoteImageDialog v-model:isDialog="store.IsSearchQuote">
    <QuoteSearch/>
  </QuoteImageDialog>


  <!-- 热门客服 -->
  <XDialog v-model="store.IsCustomer">
    <img src="/SanHe/customer_service_qrcode.jpg" alt="">
  </XDialog>
</template>
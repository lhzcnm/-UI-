<script setup lang="ts">
import QuoteHome from './components/QuoteHome.vue'
import QuoteDrawer from './components/QuoteDrawer.vue'
import QuoteProduce from './components/QuoteFilter.vue'
import QuotePopularModels from './components/QuotePopular.vue'
import QuoteTailored from './components//QuoteFilterSheet.vue'
import QuoteImageDialog from './components//QuoteImageDialog.vue'
import QuoteImage from './components/QuoteImage.vue'
import QuoteSearch from './components/QuoteSearch.vue'
import { HotModel } from './api/quote'
import { QUOTE_STORE, type quoteType } from './utils/store'
// import type { HotModelType } from '../utils/quoteType'

const IsShow = ref('home')
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

// 监听报价单图片的弹窗关闭是图片样式恢复成默认
watch(() =>store.IsImageDialog,() => {
  if(!store.IsImageDialog){
    store.quoteColorIndex = 0 
    store.quoteWatermark = ''
  }
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

onBeforeUnmount(() => {
  window.location.reload()
})
</script>

<template>
  <section class="flex flex-col w-full h-screen">
    <!-- 报价单首页 -->
    <QuoteHome v-show="IsShow == 'home'"/>

    <!-- 生成报价单抽屉 -->
    <QuoteDrawer v-model="store.IsCreateQuote">
      <QuoteProduce/> 
    </QuoteDrawer>

    <!-- 搜索功能的抽屉 -->
    <QuoteDrawer v-model="store.IsSearchQuote">
      <QuoteSearch/> 
    </QuoteDrawer>

     <!-- 热门型号抽屉 -->
    <QuoteDrawer v-model="store.IsPopularModels">
      <QuotePopularModels/>
    </QuoteDrawer>

     <!-- 个性化抽屉 -->
    <QuoteDrawer v-if="store.IsTailored" v-model="store.IsTailored">
      <QuoteTailored/>
    </QuoteDrawer>

    <!-- 热门客服 -->
    <XDialog v-model="store.IsCustomer">
      <img src="/SanHe/customer_service_qrcode.jpg" alt="" class="rounded-xl">
    </XDialog>

    <!-- 报价单弹窗 -->
    <QuoteImageDialog :is-dialog="store.IsImageDialog">
      <QuoteImage/>
    </QuoteImageDialog>
   
  </section>
</template>
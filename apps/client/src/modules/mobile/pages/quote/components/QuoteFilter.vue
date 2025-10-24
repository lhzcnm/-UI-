<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import loading from './loading.vue'
import { PriceFilter, Quotation } from '../api/quote'
import type { ColorItem } from '../utils/quoteType'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const store = inject<quoteType>(QUOTE_STORE)!
const colorsIndex = ref(0)
const watermark = ref('')
const isLoading = ref(false)
const updateSelect = ref('1')
const updatePrice = ref<number[]>([0,0,0])
const QuoteType = ref<string[]>(['香港拿货价','远望新机价','飞扬零售价'])
const phoneStatusArr = ['w-full border shadow p-4 rounded-xl space-y-2','w-full border border-black dark:border-gray-400 shadow p-4 rounded-xl space-y-2']
const colors: ColorItem[] = [
  {
    name: '星空黑',
    class: 'bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% shadow-black dark:shadow-white'
  },
  {
    name: '土豪金',
    class: 'bg-gradient-to-br from-yellow-500/80 from-30% to-yellow-500/20 to-80% shadow-yellow-500'
  },
  {
    name: '青草绿',
    class: 'bg-gradient-to-br from-green-500/80 from-30% to-green-500/20 to-80% shadow-green-500'
  },
  {
    name: '天空蓝',
    class: 'bg-gradient-to-br from-blue-500/80 from-30% to-blue-500/20 to-80% shadow-blue-500'
  },
  {
    name: '活力橙',
    class: 'bg-gradient-to-br from-orange-500/80 from-30% to-orange-500/20 to-80% shadow-orange-500'
  },
  {
    name: '玫瑰红',
    class: 'bg-gradient-to-br from-red-500/80 from-30% to-red-500/20 to-80% shadow-red-500'
  }
]

watch(() => store.IsImageDialog, () => {
  store.quoteImagePageBtnIsOpen = false
},{deep: true}) 

// 监听筛选的请求类型和手机型号
watch(
  [() => store.params.type, () => store.params.iPhoneModel],
  () => {
    quoteFilter()
  },
  { deep: true }
)

function PhoneStatusClick(value: string) {
  const ValueBool = store.phoneStatusArr.includes(value)
  if(ValueBool){
    store.phoneStatusArr = store.phoneStatusArr.filter(item => item !== value)
  }
  else{
    store.phoneStatusArr.push(value)
  }
}

function personalizedClick() {
  if(store.phoneStatusArr.length > 0){
    store.IsTailored = true
  }
  else{
    toast.warning('请选择需要生成的报价单')
  }
}

//报价单图片
function quoteImage() {
  newPrice()
  store.quoteWatermark = watermark.value
  store.quoteColorIndex = colorsIndex.value
  store.isImageAdd = true
  store.quoteImagePageBtnIsOpen = true
}
//报价单筛选的数据
async function quoteFilter() {
  isLoading.value = true

  const { type, iPhoneModel,modleId, add,reduce } = store.params
  // debugger
  try {

    const [result, res] = await Promise.all([
      PriceFilter({ type }),
      PriceFilter({ type, iPhoneModel, modleId, add ,reduce })
    ])

    store.quoteFilterDataName = result
    store.quoteFilterData = res
  } 
  catch (err) {
    console.error('报价筛选出错:', err)
  } 
  finally {
    isLoading.value = false
  }
}

// 校验加减价类型
function validatePriceType(isAdd: boolean, isReduce: boolean) {
  if (!isAdd && !isReduce) {
    console.warn('请先选择加价或减价类型')
    return false
  }
  return true
}

//批量调价
async function batchUpdatePrice(prices: number[], isAdd: boolean, isReduce: boolean) {
  const priceRequests = [1, 2, 3].map((type, i) =>
    PriceFilter({
      type,
      add: isAdd ? prices[i] ?? 0 : 0,
      reduce: isReduce ? prices[i] ?? 0 : 0
    })
  )

  const priceResults = await Promise.allSettled(priceRequests)
  const successPriceData = priceResults
    .filter(r => r.status === 'fulfilled')
    .map(r => (r as PromiseFulfilledResult<any>).value)
    .flat()

  store.quoteFilterData = []
  store.quoteFilterData.push(...successPriceData)
  console.log('✅ 批量调价结果:', successPriceData)

  return successPriceData
}

//获取报价单图片
async function fetchQuoteImage(type?: number) {
  const typeForImage = type === 0 || type === undefined ? 1 : type
  const quotationRes = await Quotation(typeForImage)

  store.quotationImageData = []
  store.quotationImageData.push(...quotationRes)

  if (store.quotationImageData.length > 0) {
    store.IsCreateQuote = false
    store.IsImageDialog = true
  }

  console.log('✅ 报价单图片:', store.quotationImageData)
  return store.quotationImageData
}

//调价 + 获取报价单
async function newPrice() {
  isLoading.value = true
  try {
    const prices = updatePrice.value || []
    const isAdd = updateSelect.value === '1'
    const isReduce = updateSelect.value === '2'

    if (!validatePriceType(isAdd, isReduce)) return

    await batchUpdatePrice(prices, isAdd, isReduce)
    await fetchQuoteImage(store.quotationImageType)

  } catch (error) {
    console.error('❌ 批量调价或获取报价单出错:', error)
  } finally {
    isLoading.value = false
  }
}

quoteFilter()
</script>

<template>
  <loading v-if="isLoading"/>
  <section class="h-screen flex flex-col bg-gray-50 dark:bg-black">

    <div class="relative h-12 flex items-center justify-center bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100 shadow-md border-b border-gray-200">
      <Icon
        icon="weui:back-filled"
        class="absolute left-3 size-5 text-gray-600 hover:text-sky-600 transition-colors duration-300 cursor-pointer"
        @click="store.IsCreateQuote = false"
      />
      <div @click="newPrice()" class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md select-none">
        个性化报价单
      </div>
    </div>
  
    <div class="px-4 py-3 mb-2 bg-white/80 dark:bg-black backdrop-blur-md rounded-b-3xl shadow-md shadow-gray-400">
      <div class="flex items-center space-x-4">
        <div class="w-26 text-gray-700 dark:text-white font-medium">报价单水印:</div>
        <XInput placeholder="请输入您的水印名称" class="flex-1" v-model="watermark"/>
      </div>
    
      <div>
        <div class="flex items-center mb-2">
          <div class="w-32 text-gray-700 dark:text-white font-medium">报价单颜色:</div>
        </div>
        <div class="grid grid-cols-3 gap-4 text-white text-center w-full pr-4">
          <div
            v-for="(item, index) in colors"
            @click="colorsIndex = index"
            :key="index"
            class="relative w-full px-2 py-1 rounded-md shadow"
            :class="item.class"
          >
            {{ item.name }}
            <span
              v-if="colorsIndex === index"
              class="absolute top-0 right-0 text-xl font-bold "
            >
              😊
            </span>
          </div>
        </div>
      </div>
    </div>
  
    <section class="flex-1 px-4 py-4 space-y-4 overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        v-for="( item , index ) in QuoteType"
        :key="item"
        @click="PhoneStatusClick(item)"
        :class="store.phoneStatusArr.includes(item) ? phoneStatusArr[1] : phoneStatusArr[0]"
        class="relative bg-white/70 dark:bg-black backdrop-blur-md rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
      >
        <div class="flex items-center mb-3">
          <div class="w-32 text-gray-700 dark:text-white font-medium">当前报价单:</div>
          <div class="flex-1 border border-gray-300 rounded text-sm text-gray-600 dark:text-white text-center py-1 cursor-pointer" @click.stop>{{ item }}</div>
        </div>
      
        <div class="flex flex-col sm:flex-row sm:items-start gap-4">
          <div class="w-32 text-gray-700 dark:text-white font-medium">整单修改:</div>
          <div class="flex-1 space-y-2">
            <select v-model="updateSelect" class="w-full p-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm" @click.stop>
              <option value="2">按金额下调</option>
              <option value="1">按金额上调</option>
              <!-- <option value="2">按比例下调(自动取整十数)</option> -->
            </select>
            <div class="flex gap-2 items-center">
              <XInput placeholder="请输入下调金额" v-model="updatePrice[index]" @click.stop class="flex-1"/>
              <div class="w-12 h-10 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 font-medium">元</div>
            </div>
          </div>
          <div v-show="store.phoneStatusArr.includes(item)" class="absolute top-15 right-5 text-lg text-gray-400/60 dark:text-gray-400 italic">已选</div>
        </div>
      </div>
    
    </section>
  
    <div class="relative h-12 flex justify-evenly items-center text-white">
      <button @click="personalizedClick()" class="w-2/5 h-10 mb-1 rounded-full shadow shadow-gray-400 bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% hover:scale-105 transition-all duration-300">个性化调整</button>
      <button @click="quoteImage()" class="w-2/5 h-10 mb-1 rounded-full shadow shadow-gray-400  bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% hover:scale-105 transition-all duration-300">生成报价单</button>
    </div>
  </section>

</template>
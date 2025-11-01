<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import loading from './loading.vue'
import { NewPriceFilter, PriceFilter, Quotation } from '../api/quote'
import type { ColorItem } from '../utils/quoteType'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const store = inject<quoteType>(QUOTE_STORE)!
const { t } = useI18n()
const colorsIndex = ref(0)
const watermark = ref('')
const isLoading = ref(false)
const updateSelect = ref('1')
const updatePrice = ref<number[]>([0,0,0])
const QuoteType = ref<string[]>([`${t('quote.RealQuote.HongKong')}`,`${t('quote.RealQuote.FarVision')}`,`${t('quote.RealQuote.Flying')}`])
const phoneStatusArr = ['w-full border shadow p-4 rounded-xl space-y-2','w-full border border-black dark:border-gray-400 shadow p-4 rounded-xl space-y-2']
const colors: ColorItem[] = [
  {
    name: `${t('quote.QuoteFilter.Color.black')}`,
    class: 'bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% shadow-black dark:shadow-white'
  },
  {
    name: `${t('quote.QuoteFilter.Color.yellow')}`,
    class: 'bg-gradient-to-br from-yellow-500/80 from-30% to-yellow-500/20 to-80% shadow-yellow-500'
  },
  {
    name: `${t('quote.QuoteFilter.Color.green')}`,
    class: 'bg-gradient-to-br from-green-500/80 from-30% to-green-500/20 to-80% shadow-green-500'
  },
  {
    name: `${t('quote.QuoteFilter.Color.sky')}`,
    class: 'bg-gradient-to-br from-blue-500/80 from-30% to-blue-500/20 to-80% shadow-blue-500'
  },
  {
    name: `${t('quote.QuoteFilter.Color.orange')}`,
    class: 'bg-gradient-to-br from-orange-500/80 from-30% to-orange-500/20 to-80% shadow-orange-500'
  },
  {
    name: `${t('quote.QuoteFilter.Color.red')}`,
    class: 'bg-gradient-to-br from-red-500/80 from-30% to-red-500/20 to-80% shadow-red-500'
  }
]

// 监听图片弹窗关闭时，自动关闭报价页按钮  
watch(
  () => store.IsImageDialog,
  (val) => {
    if (!val) store.quoteImagePageBtnIsOpen = false
  }
)

// 监听筛选参数变化（类型 或 型号）
watch(
  [() => store.params.type, () => store.params.iPhoneModel],
  ([type]) => {
    type === 2 ? newQuoteFilter() : quoteFilter()
  }
)

// 监听新机型号变化时，自动重新筛选
watch(
  () => store.newParams?.iPhoneModel,
  (val) => {
    if (val) newQuoteFilter()
  }
)

// 点击手机型号实现选中/取消
function PhoneStatusClick(value: string) {
  const exists = store.phoneStatusArr.includes(value)
  store.phoneStatusArr = exists
    ? store.phoneStatusArr.filter(item => item !== value)
    : [...store.phoneStatusArr, value]
}

// 点击“个性化生成”按钮时触发
function personalizedClick() {
  const hasSelection = store.phoneStatusArr.length > 0
  if (hasSelection) {
    store.IsTailored = true
  } else {
    toast.warning('请选择需要生成的报价单')
  }
}

// 生成报价单图片
function quoteImage() {
  newPrice()
  // 同步用户选择的水印与配色信息
  store.quoteWatermark = watermark.value
  store.quoteColorIndex = colorsIndex.value
  // 标记为新增图片模式
  store.isImageAdd = true
  // 打开报价单图片预览页按钮
  store.quoteImagePageBtnIsOpen = true
}

// 获取报价单筛选的数据（二手手机报价）
async function quoteFilter() {
  // 启动加载状态
  isLoading.value = true

  try {
    const { type, iPhoneModel, modelId, add, reduce } = store.params

    // 并发获取两组报价数据
    const [baseData, filteredData] = await Promise.all([
      PriceFilter({ type }),                        // 基础报价模板
      PriceFilter({ type, iPhoneModel, modelId, add, reduce }) // 根据条件筛选的报价
    ])

    // 更新 store 中的报价数据
    store.quoteFilterDataName = baseData
    store.quoteFilterData = filteredData

  } catch (error) {
    console.log('报价筛选出错:', error)
  } finally {
    isLoading.value = false
  }
}

// 获取远望新机报价单筛选的数据
async function newQuoteFilter() {
  // 启动加载状态
  isLoading.value = true
  try {
    const { iPhoneModel, modelId, add, reduce } = store.newParams

    // 并发请求：一个是完整数据，一个是筛选数据
    const [allData, filteredData] = await Promise.all([
      NewPriceFilter({}),                              // 获取完整机型报价列表
      NewPriceFilter({ iPhoneModel, modelId, add, reduce }) // 获取筛选后的报价数据
    ])

    // 更新 store 状态
    store.newQuoteFilterDataName = allData
    store.newQuoteFilterData = filteredData
  } catch (error) {
    console.log('❌ 新机报价筛选出错:', error)
  }finally {
    isLoading.value = false
  }
  
}

// 校验加减价类型是否有效
function validatePriceType(isAdd: boolean, isReduce: boolean): boolean {
  // 若两者均未选中，则返回校验失败
  if (!(isAdd || isReduce)) {
    console.warn('请先选择加价或减价类型')
    return false
  }
  // 校验通过
  return true
}

// 批量调价逻辑优化版
async function batchUpdatePrice(prices: number[], isAdd: boolean, isReduce: boolean) {
  try {
    // 构建请求任务（第二个元素使用 NewPriceFilter）
    const priceRequests = [1, 2, 3].map((type, index) => {
      const add = isAdd ? prices[index] ?? 0 : 0
      const reduce = isReduce ? prices[index] ?? 0 : 0
      const payload = { add, reduce, type }

      return index === 1 ? NewPriceFilter(payload) : PriceFilter(payload)
    })

    // 并发执行所有请求
    const results = await Promise.allSettled(priceRequests)

    // 提取 fulfilled 的数据
    const successData = results.flatMap(r =>
      r.status === 'fulfilled' ? r.value : []
    )

    // 更新 store
    store.quoteFilterData = [...successData]
    store.newQuoteFilterData = [...successData]

    return successData
  } catch (error) {
    console.log('❌ 批量调价异常:', error)
    return []
  }
}

// 获取报价单图片
async function fetchQuoteImage(type?: number) {
  try {
    // 规范化类型参数，默认取 1
    const typeForImage = type === 0 || type === undefined ? 1 : type

    // 请求报价单图片数据
    const quotationRes = await Quotation(typeForImage)
    if (!Array.isArray(quotationRes)) {
      throw new Error('返回数据格式错误')
    }

    // 更新 store 数据（直接覆盖，无需先清空再 push）
    store.quotationImageData = [...quotationRes]

    // 如果有数据，则显示图片弹窗
    if (store.quotationImageData.length) {
      store.IsCreateQuote = false
      store.IsImageDialog = true
    }

    return store.quotationImageData
  } catch (error) {
    console.log('❌ 获取报价单图片失败:', error)
    return []
  }
}

// 调价 + 获取报价单
async function newPrice() {
  isLoading.value = true
  try {
    // 获取当前调价参数
    const prices = updatePrice.value || []
    const isAdd = updateSelect.value === '1'
    const isReduce = updateSelect.value === '2'

    // 校验加减价类型
    if (!validatePriceType(isAdd, isReduce)) return

    // 执行批量调价并等待完成
    const updateResult = await batchUpdatePrice(prices, isAdd, isReduce)
    if (!updateResult.length) {
      console.warn('⚠️ 批量调价无有效结果')
      return
    }

    // 获取报价单图片
    await fetchQuoteImage(store.quotationImageType)

  } catch (error) {
    console.log('❌ 批量调价或获取报价单出错:', error)
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
      <div class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md select-none">
        {{ t('quote.QuoteFilter.Customized') }}
      </div>
    </div>
  
    <div class="px-4 py-3 mb-2 bg-white/80 dark:bg-black backdrop-blur-md rounded-b-3xl shadow-md shadow-gray-400">
      <div class="flex items-center space-x-4">
        <div class="w-26 text-gray-700 dark:text-white font-medium">{{ t('quote.QuoteFilter.QuoteWatermark') }}:</div>
        <XInput :placeholder="t('quote.QuoteFilter.WatermarkName')" class="flex-1 dark:border-gray-500" v-model="watermark"/>
      </div>
    
      <div>
        <div class="flex items-center mb-2">
          <div class="w-32 text-gray-700 dark:text-white font-medium">{{ t('quote.QuoteFilter.QuoteColor') }}:</div>
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
          <div class="w-32 text-gray-700 dark:text-white font-medium">{{ t('quote.QuoteFilter.NowQuoteCard.NowQuote') }}:</div>
          <div class="flex-1 border border-gray-300 dark:border-gray-500 rounded text-sm text-gray-600 dark:text-white text-center py-1 cursor-pointer" @click.stop>{{ item }}</div>
        </div>
      
        <div class="flex flex-col sm:flex-row sm:items-start gap-4">
          <div class="w-32 text-gray-700 dark:text-white font-medium">{{ t('quote.QuoteFilter.NowQuoteCard.AllQuote') }}:</div>
          <div class="flex-1 space-y-2">
            <select v-model="updateSelect" class="w-full p-2 rounded-lg border border-gray-300 bg-white dark:bg-black text-gray-700 dark:text-gray-500 text-sm" @click.stop>
              <option value="2">{{ t('quote.QuoteFilter.NowQuoteCard.AddPrice') }}</option>
              <option value="1">{{ t('quote.QuoteFilter.NowQuoteCard.ReducePrice') }}</option>
              <!-- <option value="2">按比例下调(自动取整十数)</option> -->
            </select>
            <div class="flex gap-2 items-center">
              <XInput placeholder="请输入下调金额" v-model="updatePrice[index]" @click.stop class="flex-1"/>
              <div class="w-12 h-10 flex items-center justify-center rounded-lg bg-gray-200 text-gray-700 font-medium">￥</div>
            </div>
          </div>
          <div v-show="store.phoneStatusArr.includes(item)" class="absolute top-15 right-5 text-lg text-gray-400/60 dark:text-gray-400 italic">{{ t('quote.QuoteFilter.NowQuoteCard.statu') }}</div>
        </div>
      </div>
    
    </section>
  
    <div class="relative h-12 flex justify-evenly items-center text-white">
      <button @click="personalizedClick()" class="w-2/5 h-10 mb-1 rounded-full shadow shadow-gray-400 bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% hover:scale-105 transition-all duration-300">{{ t('quote.QuoteButton.CustomAdjustment') }}</button>
      <button @click="quoteImage()" class="w-2/5 h-10 mb-1 rounded-full shadow shadow-gray-400  bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% hover:scale-105 transition-all duration-300">{{ t('quote.QuoteButton.CreateQuotation') }}</button>
    </div>
  </section>

</template>
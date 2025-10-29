<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { NewPriceFilter, PriceFilter } from '../api/quote'
import QuoteDialog from './QuoteDialog.vue'
import { QUOTE_STORE, type quoteType } from '../utils/store'
import { toast } from 'vue-sonner'

const { t } = useI18n()
const store = inject<quoteType>(QUOTE_STORE)!

const newModelTableType = [`${t('quote.ImageTableType.Color')}`, `${t('quote.ImageTableType.China')}`, `${t('quote.ImageTableType.England')}` ]
const updatePrice = ref(0)
const activeIndex = ref(0)
const iPhoneModel = ref<string[]>([])

//切换报价单
const TYPE_MAP = {
  HongKong: 1,
  FarVision: 2,
  Flying: 3,
} as const

// 定义翻译标签（响应语言变化）
const TYPE_LABELS = computed(() => ({
  [t('quote.RealQuote.HongKong')]: 'HongKong',
  [t('quote.RealQuote.FarVision')]: 'FarVision',
  [t('quote.RealQuote.Flying')]: 'Flying',
}))

function setActive(index: number, item: string) {
  // 根据当前语言翻译反查 key
  const typeKey = TYPE_LABELS.value[item] as keyof typeof TYPE_MAP
  store.params.type = TYPE_MAP[typeKey] ?? 1
  activeIndex.value = index
}

// 切换选中的 iPhone 型号
function setModes(item: string) {
  // 当前已选中的型号数组
  const models = iPhoneModel.value
  // 判断该型号是否已存在
  const exists = models.includes(item)
  // 如果存在则移除，不存在则添加
  iPhoneModel.value = exists
    ? models.filter(i => i !== item) // 过滤掉当前项
    : [...models, item]              // 添加新的选中项

}

// 确认已选择的 iPhone 型号
function ConfirmModel() {
  // 关闭自定义模块
  store.IsTailoredModules = false

  // 同步旧参数中的型号，只保留仍被选中的项
  store.params.iPhoneModel = store.params.iPhoneModel.filter(item =>
    iPhoneModel.value.includes(item)
  )

  // 定义当前要更新的目标对象
  const target =
    store.params.type === 2 ? store.newParams.iPhoneModel : store.params.iPhoneModel

  // 将未存在的型号推入目标对象（去重添加）
  iPhoneModel.value.forEach(model => {
    if (!target.includes(model)) {
      target.push(model)
    }
  })
}

// 清空已选择的 iPhone 型号
function clearChoose() {
  // 清空全局存储中的型号列表
  store.params.iPhoneModel = []

  // 清空本地选中状态
  iPhoneModel.value = []
  toast.success('已清空所有选中型号')
}

//请求数据的函数
async function quoteFilter() {

  const { type, iPhoneModel, modelId, add, reduce } = store.params
  try {
    const [result, res] = await Promise.all([
      PriceFilter({ type }),
      PriceFilter({ type, iPhoneModel, modelId, add ,reduce })
    ])

    store.quoteFilterDataName = result
    store.quoteFilterData = res
  } 
  catch (err) {
    console.error('报价筛选出错:', err)
  } 
  finally {
    updatePrice.value = 0
  }
}

//远望新机报价单筛选的数据
async function newQuoteFilter() {
  const { iPhoneModel, modelId, add, reduce } = store.newParams
  try{
    const res = await NewPriceFilter({ iPhoneModel, modelId, add ,reduce })
    const result = await NewPriceFilter({})
    store.newQuoteFilterDataName = result
    
    store.newQuoteFilterData = res
    console.log(1);
    
    console.log(res)
    
  }
  catch(err){
    console.log(err)
    
  }
  finally {
    updatePrice.value = 0
  }
}

function updateModelPrice(modelId: number, type: 'add' | 'reduce') {
  if (!Number.isFinite(modelId)) {
    console.warn('❌ 无效的 modelId:', modelId)
    return
  }

  updatePrice.value = Number.isFinite(updatePrice.value)
    ? updatePrice.value + 100
    : 0

  let safeAdd = 0
  let safeReduce = 0

  if (type === 'add') {
    safeAdd = updatePrice.value
  } else if (type === 'reduce') {
    safeReduce = updatePrice.value
  }
  store.params.add = safeAdd
  store.params.reduce = safeReduce
  store.params.modelId = modelId

  console.log(store.params.modelId);
  

  debouncedQuoteFilter()
}

function newUpdateModelPrice(modelId: number, type: 'add' | 'reduce') {
  console.log(modelId);
  
  if (!Number.isFinite(modelId)) {
    console.warn('❌ 无效的 modelId:', modelId)
    return
  }

  updatePrice.value = Number.isFinite(updatePrice.value)
    ? updatePrice.value + 100
    : 0

  let safeAdd = 0
  let safeReduce = 0

  if (type === 'add') {
    safeAdd = updatePrice.value
  } else if (type === 'reduce') {
    safeReduce = updatePrice.value
  }
  store.newParams.add = safeAdd
  store.newParams.reduce = safeReduce
  store.newParams.modelId = modelId

  console.log(store.newParams.modelId);
  

  debouncedQuoteFilterNew()
}

const debouncedQuoteFilter = debounce(quoteFilter, 500)
const debouncedQuoteFilterNew = debounce(newQuoteFilter, 500)

// 通用防抖函数
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 800): T {
  let timer: number | null = null
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  } as T
}
</script>

<template>
  <!-- <Loading v-if="isLoading"/> -->
  <section class="h-screen flex flex-col bg-gray-50 dark:bg-black">

    <!-- 顶部标题栏 -->
    <div class="relative h-12 flex items-center justify-center bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100 shadow-md border-b border-gray-200">
      <Icon
        icon="charm:circle-minus"
        class="absolute right-3 size-6 text-gray-600 hover:text-sky-600 transition-colors duration-300 cursor-pointer"
        @click="store.IsTailored = false"
      />
      <div class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md select-none">
        {{ t('quote.QuoteFilterSheet.Customization') }}
      </div>
    </div>

    <!-- 顶部状态选择 -->
    <div class="relative flex border-b border-gray-200 dark:border-gray-500 bg-white/70 dark:bg-black backdrop-blur-md">
      <div v-for="(item,index) in store.phoneStatusArr"
           @click="setActive(index,item)"
           :class="activeIndex === index ? 'flex-1 text-center font-bold text-gray-800 dark:text-white border-b-2 border-sky-500 transition-all duration-300 py-2 cursor-pointer' : 'flex-1 text-center text-gray-600 dark:text-white py-2 cursor-pointer'">
        {{ item }}
      </div>
    </div>

    <!-- 型号选择 -->
    <div v-show="store.params.type !== 2" class="px-4 py-1 flex flex-col space-y-2 bg-white/70 dark:bg-black backdrop-blur-md rounded-b-2xl shadow-sm dark:shadow-gray-400">
      <div class="flex items-center">
        <div class="w-1/3 text-gray-700 dark:text-white font-medium">{{ t('quote.QuoteFilterSheet.SelectModel') }}:</div>

        <div @click="store.IsTailoredModules = true" 
             class="relative shadow-md border border-gray-200 dark:border-gray-500 w-4/5 h-10 rounded p-1 grid grid-cols-2 gap-2 text-center text-sm overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div v-for="item in store.params.iPhoneModel" v-show="!store.IsTailoredModules"
               class="border bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 rounded-md h-6 flex items-center justify-center bg-gray-100 hover:bg-sky-50 transition-all duration-300 cursor-pointer">
            {{ item }}
          </div>

          <div v-show="store.params.iPhoneModel.length === 0"
             class="italic text-gray-400 absolute top-2 right-1/4 -translate-x-1/2 select-none">
            {{ t('quote.QuoteFilterSheet.SelectInput') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 远望新机型号选择 -->
    <div v-show="store.params.type == 2" class="px-4 py-1 flex flex-col space-y-2 bg-white/70 dark:bg-black backdrop-blur-md rounded-b-2xl  shadow-sm dark:shadow-gray-400">
      <div class="flex items-center">
        <div class="w-1/3 text-gray-700 dark:text-white font-medium">{{ t('quote.QuoteFilterSheet.SelectModel') }}:</div>

        <div @click="store.IsTailoredModules = true" 
             class="relative shadow-md border border-gray-200 dark:border-gray-400 w-4/5 h-10 rounded p-1 grid grid-cols-2 gap-2 text-center text-sm overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div v-for="item in store.newParams.iPhoneModel" v-show="!store.IsTailoredModules"
               class="border bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 rounded-md h-6 flex items-center justify-center bg-gray-100 hover:bg-sky-50 transition-all duration-300 cursor-pointer">
            {{ item }}
          </div>

          <div v-show="store.newParams.iPhoneModel.length === 0"
             class="italic text-gray-400 absolute top-2 right-1/4 -translate-x-1/2 select-none">
            {{ t('quote.QuoteFilterSheet.SelectInput') }}
          </div>
        </div>
      </div>
    </div>

    <!-- 报价单列表 -->
    <section
      v-show="store.params.type !== 2"
      class="flex-1 px-4 py-4 space-y-4 overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="(items, index) in store.quoteFilterData"
        :key="index"
        class="space-y-3 bg-white/80 dark:bg-black border dark:border-gray-500 backdrop-blur-md rounded-2xl shadow-md p-3"
      >
        <!-- 顶部型号栏 -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2 text-gray-700 dark:text-white font-medium">
            <Icon icon="clarity:mobile-phone-solid" class="text-lg" />
            <span class="text-sm">{{ items.iphoneModel }}</span>
          </div>
        
          <div class="flex space-x-2 items-center">
            <button
              @click="updateModelPrice(items.id, 'add')"
              class="bg-gradient-to-br from-black/80 dark:from-white/80 from-30% to-black/20 dark:to-white/20 to-70% w-14 h-8 rounded-md shadow hover:scale-105 transition-all duration-300 text-white"
            >
              +100
            </button>
            <button
              @click="updateModelPrice(items.id, 'reduce')"
              class="bg-gradient-to-br from-black/80 dark:from-white/80 from-30% to-black/20 dark:to-white/20 to-70% w-14 h-8 rounded-md shadow hover:scale-105 transition-all duration-300 text-white"
            >
              -100
            </button>
          </div>
        </div>
      
        <!-- 容量模块 -->
        <div
          v-for="(item, index2) in items.phoneStatusList"
          :key="index2"
          class="rounded-xl border border-gray-200 dark:border-gray-500 overflow-hidden shadow-sm"
        >
          <!-- 容量标题 -->
          <div class="w-full text-center bg-gray-100 dark:bg-black text-gray-700 dark:text-white font-medium py-1 border-b ">
            {{ item.big }}
          </div>
        
         <!-- 包裹整个表格的容器 -->
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

    <!-- 远望新机的列表 -->
    <section
      v-show="store.params.type == 2"
      class="flex-1 px-4 py-4 space-y-4 overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div
        v-for="(items, index) in store.newQuoteFilterData"
        :key="index"
        class="space-y-3 bg-white/80 dark:bg-black border dark:border-gray-500 backdrop-blur-md rounded-2xl shadow-md p-3"
      >
        <!-- 顶部机型信息 -->
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2 text-gray-700 dark:text-white font-medium">
            <Icon icon="clarity:mobile-phone-solid" class="text-lg" />
            <span class="text-sm">{{ items.iphoneModel }}</span>
          </div>
        
          <div class="flex space-x-2 items-center">
            <button
              @click="newUpdateModelPrice(items.id, 'add')"
              class="bg-gradient-to-br from-black/80 dark:from-white/80 from-30% to-black/20 dark:to-white/20 to-70% w-14 h-8 rounded-md shadow hover:scale-105 transition-all duration-300 text-white"
            >
              +100
            </button>
            <button
              @click="newUpdateModelPrice(items.id, 'reduce')"
              class="bg-gradient-to-br from-black/80 dark:from-white/80 from-30% to-black/20 dark:to-white/20 to-70% w-14 h-8 rounded-md shadow hover:scale-105 transition-all duration-300 text-white"
            >
              -100
            </button>
          </div>
        </div>
      
        <!-- 存储容量分组 -->
        <div
          v-for="(item, index2) in items.phoneStatusList"
          :key="index2"
          class="rounded-xl border border-gray-200 dark:border-gray-500 overflow-hidden"
        >
          <!-- 容量标题 -->
          <div class="w-full text-center bg-gray-100 dark:bg-black text-gray-700 dark:text-white border-b dark:border-gray-500 font-medium py-1">
            {{ item.big }}
          </div>
        
          <!-- 表头 -->
          <div
            class="grid grid-cols-[1fr,repeat(2,1fr)] bg-gray-50 dark:bg-black text-gray-700 dark:text-white font-medium text-xs border-b border-gray-200 dark:border-gray-500"
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

    <!-- 型号选择弹窗 -->
    <QuoteDialog v-model:isDialog="store.IsTailoredModules">
      <!-- 型号选择 -->
      <div v-show="store.params.type !== 2"  class="w-full h-full bg-white dark:bg-gray-900 backdrop-blur-md rounded-xl p-3 flex flex-col space-y-3">
        <div class="w-full text-center text-lg font-semibold bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text select-none py-2">
          ··· {{ t('quote.QuoteFilterSheet.SelectModel') }} ···
        </div>

        <div
          class="w-full grid grid-cols-2 gap-3 text-center text-sm overflow-y-auto scroll-smooth
                 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-1"
        >
          <div
            v-for="item in store.quoteFilterDataName"
            :key="item.iphoneModel"
            @click="setModes(item.iphoneModel)"
            class="group relative flex items-center justify-center rounded-xl border border-white/60 dark:border-gray-500
                   bg-gradient-to-br from-white/70 dark:from-black/70 via-gray-50/50 dark:via-black/50 to-gray-100/40 dark:to-black/40
                   shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                   hover:-translate-y-[2px] hover:scale-[1.02]
                   transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]
                   backdrop-blur-xl cursor-pointer select-none overflow-hidden py-3 px-2 font-medium text-gray-700 dark:text-white"
            :class="{
              'border-sky-400 bg-sky-50/70 shadow-[0_4px_16px_rgba(56,189,248,0.25)] text-sky-700':
                iPhoneModel.includes(item.iphoneModel)
            }"
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                     bg-gradient-to-br from-sky-400/15 via-blue-300/10 to-indigo-300/15 blur-2xl">
            </div>
          
            <div
              class="absolute inset-0 rounded-xl ring-1 ring-transparent
                     group-hover:ring-sky-400/40 transition-all duration-500">
            </div>
          
            <span class="relative z-10">{{ item.iphoneModel }}</span>
          
            <Icon
              icon="cuida:check-outline"
              v-if="iPhoneModel.includes(item.iphoneModel)"
              class="absolute top-1.5 right-1.5 text-lg text-sky-500 transition-all duration-300"
            />
          </div>
        </div>


        <div class="flex w-full justify-evenly space-x-2 mt-2">
          <XButton class="w-1/2 rounded-full" variant="outline" color="danger" @click="clearChoose()">{{ t('quote.QuoteButton.ClearSelection') }}</XButton>
          <XButton class="w-1/2 rounded-full" variant="outline" @click="ConfirmModel()">{{ t('quote.QuoteButton.ConfirmModel') }}</XButton>
        </div>
      </div>

      <!-- 远望新机型号选择 -->
      <div v-show="store.params.type == 2" class="w-full h-full bg-white dark:bg-gray-900 backdrop-blur-md rounded-xl p-3 flex flex-col space-y-3">
        <div class="w-full text-center text-lg font-semibold bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text select-none py-2">
          ··· {{ t('quote.QuoteFilterSheet.SelectModel') }} ···
        </div>

        <div
          class="w-full grid grid-cols-2 gap-3 text-center text-sm overflow-y-auto scroll-smooth
                 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-1"
        >
          <div
            v-for="item in store.newQuoteFilterDataName"
            :key="item.iphoneModel"
            @click="setModes(item.iphoneModel)"
            class="group relative flex items-center justify-center rounded-xl border border-white/60 dark:border-gray-500
                   bg-gradient-to-br from-white/70 dark:from-black/70 via-gray-50/50 dark:via-black/50 to-gray-100/40 dark:to-black/40
                   shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                   hover:-translate-y-[2px] hover:scale-[1.02]
                   transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]
                   backdrop-blur-xl cursor-pointer select-none overflow-hidden py-3 px-2 font-medium text-gray-700 dark:text-white"
            :class="{
              'border-sky-400 bg-sky-50/70 shadow-[0_4px_16px_rgba(56,189,248,0.25)] text-sky-700':
                iPhoneModel.includes(item.iphoneModel)
            }"
          >
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                     bg-gradient-to-br from-sky-400/15 via-blue-300/10 to-indigo-300/15 blur-2xl">
            </div>
          
            <div
              class="absolute inset-0 rounded-xl ring-1 ring-transparent
                     group-hover:ring-sky-400/40 transition-all duration-500">
            </div>
          
            <span class="relative z-10">{{ item.iphoneModel }}</span>
          
            <Icon
              icon="cuida:check-outline"
              v-if="iPhoneModel.includes(item.iphoneModel)"
              class="absolute top-1.5 right-1.5 text-lg text-sky-500 transition-all duration-300"
            />
          </div>
        </div>


        <div class="flex w-full justify-evenly space-x-2 mt-2">
          <XButton class="w-1/2 rounded-full" variant="outline" color="danger" @click="clearChoose()">{{ t('quote.QuoteButton.ClearSelection') }}</XButton>
          <XButton class="w-1/2 rounded-full" variant="outline" @click="ConfirmModel()">{{ t('quote.QuoteButton.ConfirmModel') }}</XButton>
        </div>
      </div>
    </QuoteDialog>

  </section>

</template>
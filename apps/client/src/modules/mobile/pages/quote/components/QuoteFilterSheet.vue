<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { PriceFilter } from '../api/quote'
import QuoteDialog from './QuoteDialog.vue'
import Loading from './loading.vue'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const store = inject<quoteType>(QUOTE_STORE)!
const updatePrice = ref(0)
const activeIndex = ref(0)
const isLoading = ref(false)
const iPhoneModel = ref<string[]>([])

//切换报价单
function setActive(index:number,item:string) {
  const typeMap: Record<string, number> = {
    '香港拿货价': 1,
    '远望新机价': 2,
    '飞扬零售价': 3,
  }

  store.params.type = typeMap[item] || 1
  activeIndex.value = index
}

function setModes(item:string) {
  if (iPhoneModel.value.includes(item)) {
    iPhoneModel.value = iPhoneModel.value.filter(i => i !== item)
  } else {
    iPhoneModel.value.push(item)
  }
}

function ConfirmModel() {
  store.IsTailoredModules = false
  store.params.iPhoneModel.length - 0
  store.params.iPhoneModel.push(...iPhoneModel.value)
}

function clearChoose() {
  store.params.iPhoneModel.length = 0
  iPhoneModel.value = []
}

//请求数据的函数
async function quoteFilter() {
  isLoading.value = true

  const { type, iPhoneModel, modleId, add, reduce } = store.params
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
    updatePrice.value = 0
    isLoading.value = false
  }
}

//单独修改每一个型号的价格
function updateModelPrice(modleId: number, type: 'add' | 'reduce') {
  // 参数验证
  if (!Number.isFinite(modleId)) {
    console.warn('❌ 无效的 modelId:', modleId)
    return
  }

  // 安全更新计数
  updatePrice.value = Number.isFinite(updatePrice.value)
    ? updatePrice.value + 100
    : 0

  // 初始化安全值
  let safeAdd = 0
  let safeReduce = 0

  // 根据类型分配对应值
  if (type === 'add') {
    safeAdd = updatePrice.value
  } else if (type === 'reduce') {
    safeReduce = updatePrice.value
  }
  store.params.add = safeAdd
  store.params.reduce = safeReduce
  store.params.modleId = modleId

  debouncedQuoteFilter()
}

const debouncedQuoteFilter = debounce(quoteFilter, 500)
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
  <Loading v-if="isLoading"/>
  <section class="h-screen flex flex-col bg-gray-50">

    <!-- 顶部标题栏 -->
    <div class="relative h-12 flex items-center justify-center bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100 shadow-md border-b border-gray-200">
      <Icon
        icon="weui:back-filled"
        class="absolute left-3 size-5 text-gray-600 hover:text-sky-600 transition-colors duration-300 cursor-pointer"
        @click="store.IsTailored = false"
      />
      <div class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md select-none">
        个性化定制
      </div>
    </div>

    <!-- 顶部状态选择 -->
    <div class="relative flex border-b border-gray-200 bg-white/70 backdrop-blur-md">
      <div v-for="(item,index) in store.phoneStatusArr"
           @click="setActive(index,item)"
           :class="activeIndex === index ? 'flex-1 text-center font-bold text-gray-800 border-b-2 border-sky-500 transition-all duration-300 py-2 cursor-pointer' : 'flex-1 text-center text-gray-600 py-2 cursor-pointer'">
        {{ item }}
      </div>
    </div>

    <!-- 型号选择 -->
    <div class="px-4 py-1 flex flex-col space-y-2 bg-white/70 backdrop-blur-md rounded-b-2xl shadow-inner">
      <div class="flex items-center">
        <div class="w-24 text-gray-700 font-medium">选择型号:</div>

        <div @click="store.IsTailoredModules = true" 
             class="relative shadow-md border border-gray-200 w-4/5 h-10 rounded p-1 grid grid-cols-2 gap-2 text-center text-sm overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div v-for="item in store.params.iPhoneModel" v-show="!store.IsTailoredModules"
               class="border bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-pink-500/20 rounded-md h-6 flex items-center justify-center bg-gray-100 hover:bg-sky-50 transition-all duration-300 cursor-pointer">
            {{ item }}
          </div>

          <div v-show="store.params.iPhoneModel.length === 0"
             class="italic text-gray-400 absolute top-2 right-5 -translate-x-1/2 select-none">
            点击此处进行选择
          </div>
        </div>
      </div>
    </div>

    <!-- 报价单列表 -->
    <section class="flex-1 px-4 py-4 space-y-4 overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div v-for="(items,index) in store.quoteFilterData" :key="index" class="space-y-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-md p-3">

        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2 text-gray-700 font-medium">
            <Icon icon="clarity:mobile-phone-solid" class="text-lg"/>
            <span class="text-sm">{{ items.iphoneModel }}</span>
          </div>

          <div class="flex space-x-2 items-center">
            <button @click="updateModelPrice(items.id, 'add')" class="bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% w-14 h-8 rounded-md shadow hover:scale-105 transition-all duration-300 text-white">+100</button>
            <button @click="updateModelPrice(items.id, 'reduce')" class="bg-gradient-to-br from-black/80 from-30% to-black/20 to-70% w-14 h-8 rounded-md shadow hover:scale-105 transition-all duration-300 text-white">-100</button>
            <!-- <div class="flex items-center space-x-1 text-gray-700">
              <Icon icon="formkit:radio" class="text-base"/>
              <span class="text-sm">自定义</span>
            </div> -->
          </div>
        </div>

        <div v-for="(item,index) in items.phoneStatusList" :key="index" class="rounded-xl shadow-md overflow-hidden">
          <div class="w-full text-center bg-gray-100 text-gray-700 font-medium py-1">{{ item.big }}</div>
          <div v-for="(itm,index2) in item.phoneStatus" :key="index2" class="flex justify-between items-center p-2 bg-white/80 border-b border-gray-200">
            <div class="flex items-center text-sm text-gray-600">{{ itm.status }}</div>
            <div class="flex space-x-2">
              <div class="border-2 border-gray-300 text-gray-700 text-sm px-2 rounded flex items-center justify-center">{{ itm.price || '/' }}</div>
              <!-- <div class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center justify-center">标记优势</div> -->
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- 型号选择弹窗 -->
    <QuoteDialog v-model:isDialog="store.IsTailoredModules">
      <div class="w-full h-full bg-white backdrop-blur-md rounded-xl p-3 flex flex-col space-y-3">
        <div class="w-full text-center text-lg font-semibold bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 text-transparent bg-clip-text select-none py-2">
          ··· 型号选择 ···
        </div>

        <div
          class="w-full grid grid-cols-2 gap-3 text-center text-sm overflow-y-auto scroll-smooth
                 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-1"
        >
          <div
            v-for="item in store.quoteFilterDataName"
            :key="item.iphoneModel"
            @click="setModes(item.iphoneModel)"
            class="group relative flex items-center justify-center rounded-xl border border-white/60
                   bg-gradient-to-br from-white/70 via-gray-50/50 to-gray-100/40
                   shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                   hover:-translate-y-[2px] hover:scale-[1.02]
                   transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]
                   backdrop-blur-xl cursor-pointer select-none overflow-hidden py-3 px-2 font-medium text-gray-700"
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
          <XButton class="w-1/2 rounded-full" variant="outline" color="danger" @click="clearChoose()">清空已选</XButton>
          <XButton class="w-1/2 rounded-full" variant="outline" @click="ConfirmModel()">确认型号</XButton>
        </div>
      </div>
    </QuoteDialog>

  </section>

</template>
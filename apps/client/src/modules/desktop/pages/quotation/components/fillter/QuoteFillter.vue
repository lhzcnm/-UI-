<script setup lang="ts">
import { QUOTE_FILLTER_COLOR, ALL_QUOTATION } from '../../utils/menu'
import { ref, reactive } from 'vue'
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../utils/store'
import type { HKNewType } from '../../utils/type'

const { t, locale } = useI18n()
const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!
const { settings } = useSettingStore()

const colorsIndex = ref(0)
// const watermark = ref('陆深三和')
// 创建一个对象来存储每个下拉框的选中值
const updateSelectMap = reactive<Record<number, number>>({})

ALL_QUOTATION.forEach((_, index) => {
  updateSelectMap[index] = 1; // 默认选择第一个选项，即 "加价"
})

const updatePrice = reactive<Record<number, string>>({})

// const waterMark = computed(() => {
//   return locale.value === 'zh' ? settings.title : settings.titleEn ? settings.titleEn : settings.title
// })

const watermark = ref(locale.value === 'zh' ? settings.title : settings.titleEn ? settings.titleEn : settings.title)

// 点击生成按钮
function handleGenerate(index: number) {
  const selectedAction = updateSelectMap[index]  
  store.watermark = watermark.value
  store.colorIndex = colorsIndex.value
  // console.log(store.colorIndex)
  
  store.updateIndex = index
  // 如果没有输入金额，默认为 0
  const price = updatePrice[index] ? parseFloat(updatePrice[index]) : 0

  if (ALL_QUOTATION[index] === 'quote.RealQuote.FarVision') {
    const res = updateHuaQiangBeiData(selectedAction == 1 ? 1 : 2, price)
    store.UpdateHuaQiangBeiData = res
    store.IsUpdateImageDialog = true
  }

  if (ALL_QUOTATION[index] === 'quote.RealQuote.Flying') {
    const res = updateFeiYangData(selectedAction === 1 ? 1 : 2, price)
    store.UpdateFeiYangData = res
    store.IsUpdateImageDialog = true
  }

  if (ALL_QUOTATION[index] === 'quote.RealQuote.HongKong') {
    const res = updatePrices(selectedAction === 1 ? 1 : 2, price,store.HongKongNewData)
    store.UpdateHongKongNewData = res
    store.IsUpdateImageDialog = true
  } 

  if (ALL_QUOTATION[index] === 'quote.RealQuote.Other') {
    const res = updatePrices(selectedAction === 1 ? 1 : 2, price,store.SanSungData)
    store.UpdateSanSungData = res
    store.IsUpdateImageDialog = true
  }
}

function updateHuaQiangBeiData(action: 1 | 2, amount: number) {
  const updatedData = store.HuaQiangBeiData.map(modelItem => {
    const newModels = modelItem.models.map(m => {
      const newPricesArr = m.prices.map(p => {
        const newList = p.list.map(item => {
          const newPrices = { ...item.prices }

          if (newPrices.primary !== null && newPrices.primary !== undefined) {
            let primaryVal = parseFloat(newPrices.primary)
            if (!isNaN(primaryVal)) {
              primaryVal = action === 1 ? primaryVal + amount : primaryVal - amount
              newPrices.primary = primaryVal.toFixed(0)
            }
          }

          if (newPrices.secondary !== null && newPrices.secondary !== undefined) {
            let secondaryVal = parseFloat(newPrices.secondary)
            if (!isNaN(secondaryVal)) {
              secondaryVal = action === 1 ? secondaryVal + amount : secondaryVal - amount
              newPrices.secondary = secondaryVal.toFixed(0)
            }
          }

          return { ...item, prices: newPrices }
        })

        return { ...p, list: newList }
      })

      return { ...m, prices: newPricesArr }
    })

    return { ...modelItem, models: newModels }
  })

  return updatedData
}

function updateFeiYangData(action: 1 | 2, amount: number) {
  const updatedData = store.FeiYangData.map(modelItem => {
    const newModels = modelItem.models.map(m => {
      const newPrices: any = { ...m.prices }

      Object.keys(newPrices).forEach(key => {
        const num = parseFloat(newPrices[key])
        if (!isNaN(num)) {
          newPrices[key] = (action === 1 ? num + amount : num - amount)
        }
      })

      return { ...m, prices: newPrices }
    })

    return { ...modelItem, models: newModels }
  })

  return updatedData
}

function updatePrices(
  action: 1 | 2,
  amount: number,
  data: HKNewType[]
): HKNewType[] {
  return data.map(item => ({
    ...item,
    models: item.models.map(model => ({
      ...model,
      memories: model.memories.map(memory => ({
        ...memory,
        colors: memory.colors.map(colorItem => {
          const updatedPrices: { [K in keyof typeof colorItem.prices]: string } = { ...colorItem.prices }

          const keys = Object.keys(colorItem.prices) as Array<keyof typeof colorItem.prices>

          keys.forEach(key => {
            const val = parseFloat(colorItem.prices[key])
            if (!isNaN(val)) {
              const newVal = action === 1 ? val + amount : val - amount
              updatedPrices[key] = newVal.toFixed(0)
            }
          })

          return {
            ...colorItem,
            prices: updatedPrices
          }
        })
      }))
    }))
  }))
}


</script>

<template>
  <section class="h-screen w-1/2 pb-14 flex flex-col fixed translate-x-1/2">
    <!-- 顶部筛选区 -->
    <div class="px-4 py-4 mb-3 bg-white/80 dark:bg-black backdrop-blur-xl rounded-b-3xl shadow-md border-b border-gray-200 dark:border-border transition-all">
      <!-- 水印输入 -->
      <div class="flex items-center space-x-4 mb-3">
        <div class=" text-gray-800 dark:text-gray-100 font-semibold text-sm">
          {{ t('quote.QuoteFilter.QuoteWatermark') }}:
        </div>
        <XInput
          :placeholder="t('quote.QuoteFilter.WatermarkName')"
          class="flex-1 border-gray-300/70 dark:border-gray-600/70 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition-all"
          v-model="watermark"
        />
      </div>

      <!-- 颜色筛选 -->
      <div>
        <div class="flex items-center mb-3 justify-between">
          <div class=" text-gray-800 dark:text-gray-100 font-semibold text-sm">
            {{ t('quote.QuoteFilter.QuoteColor') }}:
          </div>
          <!-- <Icon
            @click="colorBool = !colorBool"
            :icon="!colorBool ? 'iconoir:arrow-down-circle' : 'iconoir:arrow-up-circle'"
            :class="['size-6 text-gray-500 dark:text-white transition-all duration-200', !colorBool ? 'animate-ping' : '']"
          /> -->
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-3 gap-3 text-white font-medium text-center w-full pr-2">
          <div
            v-for="(item, index) in QUOTE_FILLTER_COLOR"
            :key="index"
            @click="colorsIndex = index"
            class="relative w-full py-2 rounded-xl shadow-sm cursor-pointer transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
            :class="[item.class, colorsIndex === index ? 'ring-2 ring-offset-2 ring-indigo-400 dark:ring-indigo-500' : 'opacity-90 hover:opacity-100']"
          >
            {{ t(item.name) }}
            <span v-if="colorsIndex === index" class="absolute top-0.5 right-1.5 text-lg animate-bounce">🌈</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区 -->
    <section class="grid grid-cols-2 gap-4 p-4  overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div v-for="(item, index) in ALL_QUOTATION" :key="item" class="relative group bg-gradient-to-br from-white/80 via-gray-50/80 to-white/90 dark:from-black dark:via-gray-950/80 dark:to-gray-900/90 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-border shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
        <!-- 标题行 -->
        <div class="flex items-center justify-between mb-4">
          <div class="text-gray-800 dark:text-gray-100 font-semibold text-sm">
            {{ t('quote.QuoteFilter.NowQuoteCard.NowQuote') }}:
          </div>

          <div
            class="flex-1 ml-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg text-sm text-gray-700 dark:text-white text-center py-2 font-medium
                   bg-gradient-to-r from-gray-50 via-gray-100 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-950
                   hover:shadow-md transition-all duration-200"
          >
            {{ t(item) }}
          </div>
        </div>

        <!-- 价格调整行 -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
          <div class="text-gray-700 dark:text-gray-300 font-semibold text-sm shrink-0">
            {{ t('quote.QuoteFilter.NowQuoteCard.AllQuote') }}:
          </div>

          <XSelect v-model="updateSelectMap[index]" :placeholder="t('quote.text')">
            <XSelectItem value="1">{{ t('quote.QuoteFilter.NowQuoteCard.AddPrice') }}</XSelectItem>
            <XSelectItem value="2">{{ t('quote.QuoteFilter.NowQuoteCard.ReducePrice') }}</XSelectItem>
          </XSelect>

          <XInput
            :placeholder="t('quote.EnterAmount')"
            type="number"
            v-model="updatePrice[index]"
            @click.stop
            class="flex-1 min-w-[140px] text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600
                   px-3 py-2 shadow-sm bg-gradient-to-r from-white/90 via-gray-50/90 to-white/95 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950
                   focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 hover:border-indigo-400 dark:hover:border-indigo-500
                   transition-all duration-200"
          />

          <div
            class="px-4 py-2 rounded-xl bg-gradient-to-br from-green-100 via-green-200 to-green-100 dark:from-green-800 dark:via-green-700 dark:to-green-800
                   text-gray-800 dark:text-gray-200 font-semibold text-sm select-none shadow-md border border-gray-200 dark:border-gray-600
                   hover:scale-[1.03] hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
            @click="handleGenerate(index)"
          >
            {{ t('quote.Generate') }}
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

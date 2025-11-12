<script setup lang="ts">
import { computed, inject } from 'vue'
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../utils/store'
const { t } = useI18n()
const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!
if (!store) throw new Error('QUOTE_STORE 注入失败')

// 外观映射：store.selectedAppearances 数字 -> prices key
const appearanceMap: Record<number, keyof typeof store.FeiYangData[0]['models'][0]['prices']> = {
  1: 'new',
  2: 'good',
  3: 'smallFlower',
  4: 'bigFlower',
}

// 批量过滤数据
const filteredData = computed(() => {
  return store.FeiYangData
    // 型号过滤
    .filter(series => store.selectedTypes.length ? store.selectedTypes.includes(series.type) : true)
    .map(series => ({
      ...series,
      models: series.models
        // 容量过滤
        .filter(model => store.selectedSizes.length ? store.selectedSizes.includes(model.memory) : true)
        // 外观过滤
        .map(model => {
          const filteredPrices: Record<string, string> = {}
          const appearances = store.selectedAppearances.length ? store.selectedAppearances : [1,2,3,4]
          for (const num of appearances) {
            const key = appearanceMap[num]
            if (key && model.prices[key] !== undefined) filteredPrices[key] = model.prices[key]
          }
          return { ...model, prices: filteredPrices }
        })
        .filter(model => Object.keys(model.prices).length > 0)
    }))
    .filter(series => series.models.length > 0)
})

</script>

<template>
  <div class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- 无数据提示 -->
    <div
      v-if="!filteredData.length"
      class="col-span-full text-center text-gray-500 dark:text-gray-400 py-10"
    >
      {{ t('quote.NoData') }}
    </div>

    <!-- 渲染数据 -->
    <div
      v-for="(series, si) in filteredData"
      :key="si"
      class="bg-white dark:bg-black border border-gray-200 dark:border-border rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <!-- 型号 -->
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
        {{ series.type }}
      </h2>

      <!-- 备注 -->
      <p class="text-xs text-gray-500 dark:text-gray-400 italic mb-3">
        {{ series.remark }}
      </p>

      <!-- 容量 + 价格 -->
      <template v-for="(model) in series.models" >
        <div class="mb-3">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 border-b border-gray-200 dark:border-gray-700 pb-0.5">
            {{ model.memory }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            <div
              v-for="(price, key) in model.prices"
              :key="key"
              :class="{
                'bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-800': key==='new',
                'bg-green-50 dark:bg-green-900/40 hover:bg-green-100 dark:hover:bg-green-800': key==='good',
                'bg-yellow-50 dark:bg-yellow-900/40 hover:bg-yellow-100 dark:hover:bg-yellow-800': key==='smallFlower',
                'bg-red-50 dark:bg-red-900/40 hover:bg-red-100 dark:hover:bg-red-800': key==='bigFlower',
              }"
              class="rounded-lg p-2 transition-colors"
            >
              <div class="flex justify-between items-center mb-0.5">
                <span class="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {{
                    t(key==='new' ? 'quote.PopularModel.Refurbished'
                    : key==='good' ? 'quote.PopularModel.Premium'
                    : key==='smallFlower' ? 'quote.PopularModel.MinorWear'
                    : 'quote.PopularModel.MajorWear')
                  }}
                </span>
                <span class="text-xs text-gray-600 dark:text-gray-300">￥{{ price }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

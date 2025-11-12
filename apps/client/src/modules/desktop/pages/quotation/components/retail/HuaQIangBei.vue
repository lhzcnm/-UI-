<script setup lang="ts">
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../utils/store'
import { ColorEnumNames } from '../../utils/menu'

const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!
const { t } = useI18n()
// 搜索逻辑（批量过滤）
const filteredData = computed(() => {
  return store.HuaQiangBeiData
    .filter(series => {
      // 型号批量过滤
      return store.selectedTypes.length
        ? store.selectedTypes.includes(series.model)
        : true
    })
    .map(series => ({
      ...series,
      models: series.models.map(model => ({
        ...model,
        prices: model.prices
          // 容量批量过滤
          .filter(item =>
            store.selectedSizes.length
              ? store.selectedSizes.includes(item.memory)
              : true
          )
          .map(item => ({
            ...item,
            // 颜色批量过滤
            list:
              store.selectedColors.length > 0
                ? item.list.filter(i =>
                    store.selectedColors.includes(i.color)
                  )
                : item.list
          }))
          // 去掉没有数据的容量
          .filter(item => item.list.length > 0)
      }))
    }))
    // 去掉没有数据的型号
    .filter(series => series.models.some(model => model.prices.length > 0))
})


</script>

<template>
  <div 
    class="p-6 bg-gray-50 dark:bg-black"
    :class="{
      'flex justify-center items-start min-h-screen space-x-6': filteredData.length < 4,
      'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6': filteredData.length >= 4
    }">
    <!-- 无数据提示 -->
    <div
      v-if="!filteredData.length"
      class="col-span-full text-center text-gray-500 dark:text-gray-400 py-10"
    >
      {{ t('quote.NotData') }}
    </div>
    
    <div
      v-for="(series, si) in filteredData"
      :key="si"
      class="bg-white dark:bg-black border border-gray-200 dark:border-border rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <!-- 型号标题 -->
      <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">{{ series.model }}</h2>

      <template v-for="(model, mi) in series.models" :key="mi">
        <!-- 型号备注 -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-3 italic truncate">{{ model.remark }}</p>

        <!-- 容量卡片 -->
        <div v-for="(p, pi) in model.prices" :key="pi" class="mb-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
            {{ p.memory }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="(item, idx) in p.list"
              :key="idx"
              :class="[
                'rounded-lg p-3 transition-colors',
                'text-gray-900 dark:text-gray-100',
                'hover:bg-blue-100',
                'bg-blue-50 dark:bg-blue-900/40' // 这里可以改为 bg-red-50/红色对应未激活
              ]"
            >
              <div class="flex justify-between items-center mb-1">
                <span class="font-medium text-sm">{{ t(ColorEnumNames[item.color]) }}</span>
              </div>
              <div class="flex flex-wrap justify-between text-xs text-gray-600 dark:text-gray-300 gap-1">
                <span>{{ t('quote.TableHeaders.Header3') }}：￥{{ item.prices.primary }}</span>
                <span class="text-red-500">{{ t('quote.TableHeaders.Header4') }}：￥{{ item.prices.secondary }}</span>
              </div>
            </div>

          </div>
        </div>
      </template>
    </div>
  </div>
</template>


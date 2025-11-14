<script setup lang="ts">
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../utils/store'

const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!
const { t } = useI18n()
const filteredData = computed(() => {
  if (!Array.isArray(store.SanSungData)) return [];

  return store.SanSungData
    // ① 筛选型号
    .filter(series =>
      store.selectedTypes.length
        ? store.selectedTypes.includes(series.type)
        : true
    )
    // ② 遍历 models
    .map(series => ({
      ...series,
      models: (series.models || []).map(model => ({
        ...model,
        // ③ 处理 memories
        memories: (model.memories || [])
          // 内存筛选
          .filter(memory =>
            store.selectedSizes.length
              ? store.selectedSizes.includes(memory.memory)
              : true
          )
          // ④ 筛选 colors
          .map(memory => {
            const filteredColors = (memory.colors || []).filter(colorItem =>
              store.selectedColors.length
                ? store.selectedColors.includes(colorItem.color)
                : true
            );

            return {
              memory: memory.memory,
              colors: filteredColors
            };
          })
          // 去掉没有任何颜色的 memory
          .filter(mem => mem.colors.length > 0)
      }))
    }))
    // ⑤ 去掉没有 memory 的 series
    .filter(series =>
      series.models.some(model => model.memories.length > 0)
    );
});

</script>

<template>
  <div 
    class="grid grid-cols-1 gap-6 p-2">
    <!-- 无数据提示 -->
    <div
      v-if="!filteredData.length"
      class="col-span-full text-center text-gray-500 dark:text-gray-400 py-10"
    >
      {{ t('quote.NoData') }}
    </div>
    
    <div
      v-for="(series, si) in filteredData"
      :key="si"
      :class="{'w-full':  filteredData.length < 5}"
      class="bg-gradient-to-br from-white/90 to-gray-100/50 dark:from-black/90 dark:to-black/50 border border-gray-200 dark:border-border rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <!-- 型号标题 -->
      <h2 class="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
        {{ series.type }}
      </h2>

      <template v-for="(model, mi) in series.models" :key="mi">
        <!-- 型号备注 -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 italic truncate">{{ model.remark }}</p>

        <!-- 容量卡片 -->
        <div v-for="(p, pi) in model.memories" :key="pi" class="mb-3">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 border-b border-gray-200 dark:border-gray-700 pb-0.5">
            {{ p.memory }}
          </h3>

          <div class="grid grid-cols-1 gap-2">
            <div v-if="p.colors && p.colors.length">
              <!-- <h4 class="text-xs font-medium text-red-500 dark:text-red-400 mb-1">未激活</h4> -->
              <div class="w-full grid grid-cols-2 gap-2">
                <div
                  v-for="(item, idx) in p.colors"
                  :key="'inactive-' + idx"
                  class=" border border-pink-100 dark:border-pink-500/50
                         bg-pink-50/40 dark:bg-pink-400/20  rounded-lg p-2 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                >
                  <div class="flex justify-between items-center mb-0.5">
                    <span class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ item.color  }}</span>
                    <!-- <span class="text-xs text-red-600 dark:text-red-400">未激活</span> -->
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-300 ">
                    <span>{{ t('quote.TableHeaders3.Header6') }}：{{ store.priceIcon }}: {{ item.prices.BrandNew }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </template>
    </div>
    
  </div>
</template>

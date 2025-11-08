<script setup lang="ts">
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../utils/store'
import { ColorEnumNames } from '../../utils/menu'

const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!
const { t } = useI18n()
// 搜索逻辑
const filteredData = computed(() => {
  const filtered = store.HongKongNewData
    .filter((series) =>
      store.selectedTypes.length ? store.selectedTypes.includes(series.type) : true
    )
    .map((series) => ({
      ...series,
      models: Array.isArray(series.models)
        ? series.models.map((model) => ({
            ...model,
            memories: model.memories
              .filter((memory) =>
                store.selectedSizes.length ? store.selectedSizes.includes(memory.memory) : true
              )
              .map((memory) => {
                const newMemory: any = { memory: memory.memory }

                if (store.selectedStatuses.length) {
                  if (store.selectedStatuses.includes(1)) {
                    newMemory.active = memory.active
                      ? (store.selectedColors.length
                          ? memory.active.filter((i) => store.selectedColors.includes(i.color))
                          : memory.active)
                      : []
                  }
                  if (store.selectedStatuses.includes(2)) {
                    newMemory.inactive = memory.inactive
                      ? (store.selectedColors.length
                          ? memory.inactive.filter((i) => store.selectedColors.includes(i.color))
                          : memory.inactive)
                      : []
                  }
                } else {
                  newMemory.active = memory.active
                    ? (store.selectedColors.length
                        ? memory.active.filter((i) => store.selectedColors.includes(i.color))
                        : memory.active)
                    : []
                  newMemory.inactive = memory.inactive
                    ? (store.selectedColors.length
                        ? memory.inactive.filter((i) => store.selectedColors.includes(i.color))
                        : memory.inactive)
                    : []
                }

                return newMemory
              })
              .filter(
                (memory) =>
                  (memory.active && memory.active.length) || (memory.inactive && memory.inactive.length)
              ),
          }))
        : [],
    }))
    .filter((series) => series.models.some((model) => model.memories.length > 0))

  return filtered
})
</script>

<template>
  <div
    class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-colors duration-300 
           bg-gray-50 dark:bg-black"
  >
    <!-- 无数据提示 -->
    <div
      v-if="!filteredData.length"
      class="col-span-full text-center text-gray-500 dark:text-gray-400 py-10"
    >
      {{ t('quote.NotData') }}
    </div>

    <!-- 主卡片 -->
    <div
      v-for="(series, si) in filteredData"
      :key="si"
      class="bg-white dark:bg-black border border-gray-200 dark:border-border
             rounded-xl p-4 shadow-md hover:shadow-lg 
             dark:hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] 
             transition-all duration-300"
    >
      <!-- 型号标题 -->
      <h2
        class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate 
               border-b border-gray-100 dark:border-gray-800 pb-1"
      >
        {{ series.type }}
      </h2>

      <template v-for="(model, mi) in series.models" :key="mi">
        <!-- 型号备注 -->
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2 italic truncate">
          {{ model.remark }}
        </p>

        <!-- 容量区块 -->
        <div v-for="(p, pi) in model.memories" :key="pi" class="mb-3">
          <h3
            class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 
                   border-b border-gray-200 dark:border-gray-700 pb-0.5"
          >
            {{ p.memory }}
          </h3>

          <div class="grid grid-cols-1 gap-2">
            <!-- 已激活 -->
            <div v-if="p.active && p.active.length">
              <h4 class="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">{{ t('quote.TableHeaders.Header3') }}</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="(item, idx) in p.active"
                  :key="'active-' + idx"
                  class="rounded-lg p-2 border border-indigo-100 dark:border-indigo-900/40
                         bg-indigo-50/70 dark:bg-indigo-950/40 
                         hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all"
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {{ t(ColorEnumNames[item.color]) }}
                    </span>
                    <span class="text-xs text-indigo-600 dark:text-indigo-400">{{ t('quote.TableHeaders.Header3') }}</span>
                  </div>
                  <div class="text-xs text-gray-700 dark:text-gray-300 flex flex-wrap justify-between gap-x-2">
                    <span>{{ t('quote.TableHeaders3.Header4') }}：￥{{ item.prices.primary }}</span>
                    <span>{{ t('quote.TableHeaders3.Header5') }}：￥{{ item.prices.secondary }}</span>
                    <span>{{ t('quote.TableHeaders3.Header6') }}：￥{{ item.prices.source }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 未激活 -->
            <div v-if="p.inactive && p.inactive.length">
              <h4 class="text-xs font-medium text-red-600 dark:text-red-400 mb-1">{{ t('quote.TableHeaders.Header4') }}</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  v-for="(item, idx) in p.inactive"
                  :key="'inactive-' + idx"
                  class="rounded-lg p-2 border border-red-100 dark:border-red-900/40
                         bg-red-50/70 dark:bg-red-950/40 
                         hover:bg-red-100 dark:hover:bg-red-900/60 transition-all"
                >
                  <div class="flex justify-between items-center mb-1">
                    <span class="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {{ t(ColorEnumNames[item.color]) }}
                    </span>
                    <span class="text-xs text-red-600 dark:text-red-400">{{ t('quote.TableHeaders.Header4') }}</span>
                  </div>
                  <div class="text-xs text-gray-700 dark:text-gray-300 flex flex-wrap justify-between gap-x-2">
                    <span>{{ t('quote.TableHeaders3.Header4') }}：￥{{ item.prices.primary }}</span>
                    <span>{{ t('quote.TableHeaders3.Header5') }}：￥{{ item.prices.secondary }}</span>
                    <span>{{ t('quote.TableHeaders3.Header6') }}：￥{{ item.prices.source }}</span>
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

<style scoped>
button {
  user-select: none;
}
</style>

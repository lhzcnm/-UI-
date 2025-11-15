<script setup lang="ts">
import { quoteApi } from '../../../api/http'
import { type QUOTE_STORE_TYPE, QUOTE_STORE } from '../../../utils/store'
import { ref, inject, watch, onMounted } from 'vue'
import { ConditionNames } from '../../../utils/menu'

const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!

// 可选项
const types = ref<string[]>([])
const sizes = ref<string[]>([])
const appearances = ref<number[]>([]) // ✅ 外观为数字数组
const colors = ref<string[]>([])

// 临时选中项
const tempSelectedTypes = ref<string[]>([])
const tempSelectedSizes = ref<string[]>([])
const tempSelectedStatuses = ref<number[]>([])  // 改为数字数组
const tempSelectedAppearances = ref<number[]>([])
const tempSelectedColors = ref<string[]>([])
const { t } = useI18n()
/** 初始化临时选中项 */
function initTempSelected() {
  tempSelectedTypes.value = [...store.selectedTypes]
  tempSelectedSizes.value = [...store.selectedSizes]
  tempSelectedStatuses.value = [...store.selectedStatuses]
  tempSelectedAppearances.value = [...store.selectedAppearances]
  tempSelectedColors.value = [...store.selectedColors]
}

/** 监听面板打开状态（恢复上次选择） */
watch(
  () => store.OpenSearch,
  (newVal) => {
    if (newVal) initTempSelected()
  },
  { immediate: true }
)

/** 通用多选切换函数 */
function toggleSelection(
  target: 'type' | 'size' | 'status' | 'appearance' | 'color',
  value: string | number
) {
  let arr: (string | number)[] = []

  switch (target) {
    case 'type':
      arr = tempSelectedTypes.value
      break
    case 'size':
      arr = tempSelectedSizes.value
      break
    case 'status':
      arr = tempSelectedStatuses.value
      value = Number(value)  // 将状态值转换为数字
      break
    case 'appearance':
      arr = tempSelectedAppearances.value
      value = Number(value)
      break
    case 'color':
      arr = tempSelectedColors.value
      value = value 
      break
    default:
      return
  }

  const index = arr.indexOf(value)
  if (index === -1) arr.push(value)
  else arr.splice(index, 1)
}

/** 清空临时选择 */
function handleClear() {
  tempSelectedTypes.value = []
  tempSelectedSizes.value = []
  tempSelectedStatuses.value = []
  tempSelectedAppearances.value = []
  tempSelectedColors.value = []
}

/** 确定（同步临时选择到 store） */
function handleConfirm() {
  store.selectedTypes = [...tempSelectedTypes.value]
  store.selectedSizes = [...tempSelectedSizes.value]
  store.selectedStatuses = [...tempSelectedStatuses.value]
  store.selectedAppearances = [...tempSelectedAppearances.value]
  store.selectedColors = [...tempSelectedColors.value]
  store.OpenSearch = false
}

/** 获取华强北搜索数据 */
async function HQBSearchData() {
  const res = await quoteApi.HuaQiangBeiSearch()
  types.value = res.models
  sizes.value = res.memories
  colors.value = res.colors
}

/** 获取飞扬搜索数据 */
async function FYSearchData() {
  const res = await quoteApi.FeiYang()
  types.value = res.models
  sizes.value = res.memories
  appearances.value = res.conditions.map((a: number) => Number(a))
}

/** 获取香港新机的搜索数据 */
async function HKNewData() {
  const res = await quoteApi.HongKongNew()
  types.value = res.models
  sizes.value = res.memories
  // statuses.value = res.status.map((status: string) => Number(status))  // 转换为数字数组
  console.log(res.colors)
  
  colors.value = res.colors
}

/** 获取香港三星的搜索数据 */
async function SXSearchData() {
  const res = await quoteApi.SanXin()
  types.value = res.models
  sizes.value = res.memories
  colors.value = res.colors
}


onMounted(() => {
  if (store.activeTab == 0) {
    HKNewData()
  }
  if (store.activeTab == 1) {
    FYSearchData()
  }
  if (store.activeTab == 2) {
    HQBSearchData()
  }
  if (store.activeTab == 3) {
    SXSearchData()
  }
})
</script>

<template>
  <div class="h-full flex flex-col justify-between">
    <div class="h-[calc(100%-6rem)] space-y-3 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-10">
      <!-- 型号 -->
      <div>
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('quote.ImageTableType.Models') }}</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="t in types"
            :key="t"
            @click="toggleSelection('type', t)"
            class="px-3 py-1 rounded-full border text-sm transition-all duration-150"
            :class="tempSelectedTypes.includes(t)
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            {{ t }}
          </button>
        </div>
      </div>

      <!-- 容量 -->
      <div>
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('quote.ImageTableType.Capacity') }}</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in sizes"
            :key="s"
            @click="toggleSelection('size', s)"
            class="px-3 py-1 rounded-full border text-sm transition-all duration-150"
            :class="tempSelectedSizes.includes(s)
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            {{ s }}
          </button>
        </div>
      </div>

      <!-- 状态 -->
      <!-- <div v-show="store.activeTab == 3 || store.activeTab == 0">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('quote.ActivationStatus') }}</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="s in statuses"
            :key="s"
            @click="toggleSelection('status', s)"
            class="px-3 py-1 rounded-full border text-sm transition-all duration-150"
            :class="tempSelectedStatuses.includes(s)
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            {{ s == 2 ? t('quote.TableHeaders.Header4') : t('quote.TableHeaders.Header3') }}
          </button>
        </div>
      </div> -->

      <!-- 外观 -->
      <div v-show="store.activeTab == 1">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('quote.Appearance') }}</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="a in appearances"
            :key="a"
            @click="toggleSelection('appearance', a)"
            class="px-3 py-1 rounded-full border text-sm transition-all duration-150"
            :class="tempSelectedAppearances.includes(a)
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            {{ t(ConditionNames[a]) }}
          </button>
        </div>
      </div>

      <!-- 颜色 -->
      <div v-show="store.activeTab !== 1">
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('quote.TableHeaders3.Header3') }}</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in colors"
            :key="c"
            @click="toggleSelection('color', c)"
            class="px-3 py-1 rounded-full border text-sm transition-all duration-150"
            :class="tempSelectedColors.includes(c)
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
          >
            {{ c }}
          </button>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="flex justify-end gap-3 py-2 border-t border-gray-200 dark:border-gray-700  sticky bottom-0">
      <button
        @click="handleClear"
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {{ t('button.clear') }}
      </button>
    
      <button
        @click="handleConfirm"
        class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-white dark:text-white hover:bg-blue-100 dark:hover:bg-blue-700 transition-colors bg-primary"
      >
        {{ t('button.confirm') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
button {
  user-select: none;
}
</style>

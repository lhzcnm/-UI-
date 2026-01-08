<script setup lang="ts">
import type { ServiceHeader } from '@/api/services'

const { t, locale } = useI18n()
const props = defineProps<{
  headers: ServiceHeader[]
}>()


// 点击确定时回调
const emit = defineEmits<{
  (e: 'confirm', selected: ServiceHeader[]): void
}>()

// 临时存储勾选的字段 name
const selectedNames = ref<string[]>(props.headers.map(item => item.name))

// 计算勾选的完整字段对象
const selectedHeaders = computed(() =>
  props.headers.filter(item => selectedNames.value.includes(item.name))
)

// 点击确定，发送选中的字段数组给父组件
function confirmSelection() {
  emit('confirm', selectedHeaders.value)
}
</script>

<template>
  <div class="filter-modal">
    <h3 class="mb-2 font-bold">字段筛选</h3>

    <div class="flex flex-col gap-1 mb-4 max-h-64 overflow-auto">
      <label
        v-for="item in props.headers"
        :key="item.name"
        class="flex items-center gap-2"
      >
        <input
          type="checkbox"
          :value="item.name"
          v-model="selectedNames"
        />
        {{ locale === 'zh' ? item.name : item.nameEn ? item.nameEn : item.name }}
      </label>
    </div>

    <div class="flex justify-end gap-2">
      <button
        class="px-3 py-1 border rounded"
        @click="selectedNames = props.headers.map(item => locale === 'zh' ? item.name : item.nameEn ? item.nameEn : item.name)"
      >
        全选
      </button>
      <button
        class="px-3 py-1 border rounded"
        @click="selectedNames = []"
      >
        全不选
      </button>
      <button
        class="px-4 py-1 bg-blue-500 text-white rounded"
        @click="confirmSelection"
      >
        确定
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORY_MAP_LIST } from '@desktop/pages/store/utils/device'
import type { ProductItem } from '@desktop/pages/store/utils/types'

interface ProductCardProps {
  product: ProductItem,
}

defineProps<ProductCardProps>()

// const specs = computed(() => {
//   return Object.entries(props.product.specs).map(([key, value]) => ({
//     key, value
//   }))
// })
</script>

<template>
  <div class="group flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer">
    <div class="text-center mb-4 overflow-hidden rounded-lg">
      <img
        class="inline-block h-48 md:h-40 object-cover"
        :src="product.image" :alt="product.name"
        loading="lazy">
    </div>

    <div class="p-6 flex-1 flex flex-col">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{{ CATEGORY_MAP_LIST[product.category].name }}</span>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 line-through">￥{{ product.originalPrice }}</span>
          <span class="text-lg font-semibold text-primary">￥{{ product.price }}</span>
        </div>
      </div>

      <h3 class="text-xl font-semibold mb-2">{{ product.name }}</h3>
      <p class="text-gray-600 mb-4 line-clamp-2">{{ product.description }}</p>

      <div class="flex items-center felx-wrap gap-2 mb-4">
        <span class="text-sm text-gray-600">颜色: </span>
        <div class="flex space-x-1">
          <div
            v-for="color in product.colors.slice(0, 4)" :key="color">
            <div class="size-4 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 border border-gray-300"></div>
          </div>

          <span v-show="product.colors.length > 4" class="text-xs text-gray-500">+更多</span>
        </div>
      </div>

      <div class="flex-1 flex">
        <button class="w-full bg-primary px-6 py-3 rounded-full text-white self-end">
          查看详情
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeviceCategory } from '../../utils/types'

interface CategoryProps {
  categorys: DeviceCategory[]
}

defineProps<CategoryProps>()

const currentCategory = defineModel<number>({ required: true })
</script>

<template>
  <div class="flex justify-center mb-8">
    <div class="flex space-x-2 bg-white dark:bg-zinc-900 rounded-full p-2 shadow-md">
      <template v-for="category in categorys" :key="category.id">
        <button
          class="px-6 py-2 rounded-full font-semibold transition-colors"
          :class="{ 'bg-primary text-white': currentCategory === category.id }"
          @click="currentCategory = category.id">
          {{ category.name }}
        </button>
      </template>
    </div>
  </div>
</template>

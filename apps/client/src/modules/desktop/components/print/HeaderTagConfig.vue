<script setup lang="ts">
import type { TemplateType } from '@/types'
import type { HeaderTag } from '@/types/print'

interface PaperConfigProps {
  headers: HeaderTag[],
  selectCols: string[],
  title: string
}

interface PaperConfigEmits {
  selected: [id: string, type: TemplateType]
}

defineProps<PaperConfigProps>()
const emits = defineEmits<PaperConfigEmits>()
</script>

<template>
  <div class="border p-2 space-y-1">
    <div class="font-bold text-sm">{{ title }}</div>
    <div class="flex flex-wrap gap-2">
      <template v-for="item in headers" :key="item.key">
        <HeaderTag :label="item.label" :id="item.key" :checked="selectCols.includes(item.key)" :type="item.type"
          @click="emits('selected', item.key, item.type)" />
      </template>
    </div>
  </div>
</template>

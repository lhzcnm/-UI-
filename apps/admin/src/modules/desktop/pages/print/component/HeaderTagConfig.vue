<script setup lang="ts">
import HeaderTagVue from './HeaderTagVue.vue'

import type { TemplateType } from '../type'
import type { HeaderTag } from '../type'

interface PaperConfigProps {
  headers: HeaderTag[],
  selectCols: string[],
}

interface PaperConfigEmits {
  selected: [id: string, type: TemplateType]
}

defineProps<PaperConfigProps>()
const emits = defineEmits<PaperConfigEmits>()
</script>

<template>
  <div class="border p-2 space-y-1">
    <div class="font-bold text-sm">字段选择</div>
    <div class="flex flex-wrap gap-2">
      <template v-for="item in headers" :key="item.key">
        <HeaderTagVue :label="item.label" :id="item.key" :checked="selectCols.includes(item.key)" :type="item.type"
          @click="emits('selected', item.key, item.type)" />
      </template>
    </div>
  </div>
</template>

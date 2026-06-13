<script setup lang="ts">
import { Icon } from '@iconify/vue'
import usePrinter from '@/composable/print'
import type { ContainerItem } from '@/types'
import { getLanuagestring } from '@/utils/constant'
import { LAYOUT_POSITION, LAYOUT_POSITION_LIST } from '@/types/print'

interface PaperConfigEmits {
  selectLayout: [layout: LAYOUT_POSITION]
}

const localStore = useLocalStore()

const container = defineModel<ContainerItem>({ required: true })
const emits = defineEmits<PaperConfigEmits>()

const iStore = useSystemStore()

// const directionOptions: PaperDirectionOption[] = [
//   { value: 'portrait', label: t('print.direction.portrait') },
//   { value: 'landscape', label: t('print.direction.landscape') },
// ]

const { directionOptions } = usePrinter()

function getDate() {
  return Date.now()
}
</script>

<template>
  <div class="grid grid-cols-3 gap-4 p-2 rounded-md border border-border shadow-sm">
    <!-- 字体大小 -->
    <div class="flex flex-col space-y-4">
      <!-- 纸张方向 -->
      <div>
        <div class="font-semibold text-sm">{{ localStore.localData['print_PaperOrientation'] }}</div>
        <div class="flex items-center gap-4 text-sm">
          <template v-for="option in directionOptions" :key="option.value">
            <button class="flex items-center gap-1 text-lg"
              :class="{ 'text-primary': option.value === container.orientation }"
              @click="container.orientation = option.value">
              <Icon icon="solar:smartphone-linear" :rotate="option.value === 'landscape' ? 45 : 0" />
              <span>{{ option.label }}</span>
            </button>
          </template>
        </div>
      </div>
      <div>
        <div class="font-semibold text-sm">{{ getLanuagestring('align_layout', iStore.lang) }}</div>
        <XSelect
          ui-trigger="mt-2"
          v-model="container.layout"
          @selected="emits('selectLayout', $event)"
        >
          <XSelectItem
            v-for="layout in LAYOUT_POSITION_LIST" :key="`${layout.value}${getDate()}`"
            :label="layout.label" :value="layout.value"
          />
        </XSelect>
      </div>
    </div>
    <!-- 纸张大小 -->
    <div class="flex flex-col space-y-1">
      <div class="font-semibold text-sm">{{ localStore.localData['print_PaperSize'] }} (mm)</div>
      <div class="flex items-center gap-2">
        <span class="text-xs w-16">{{ localStore.localData['print_Long'] }}(mm):</span>
        <XInputNumber v-model="container.width" :step="1" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs w-16">{{ localStore.localData['print_Width'] }}(mm):</span>
        <XInputNumber v-model="container.height" :step="1" size="sm" />
      </div>
    </div>
    <!-- 内边距设置 -->
    <div class="flex flex-col space-y-1">
      <div class="font-semibold text-sm">{{ localStore.localData['print_PageMargins'] }} (mm)</div>
      <div class="flex items-center gap-2">
        <span class="text-xs w-16">{{ localStore.localData['print_Top'] }}(mm):</span>
        <XInputNumber v-model="container.padding.top" :step="1" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs w-16">{{ localStore.localData['print_Bottom']  }}(mm):</span>
        <XInputNumber v-model="container.padding.bottom" :step="1" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs w-16">{{ localStore.localData['print_Left'] }}(mm):</span>
        <XInputNumber v-model="container.padding.left" :step="1" size="sm" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs w-16">{{ localStore.localData['print_Right'] }}(mm):</span>
        <XInputNumber v-model="container.padding.right" :step="1" size="sm" />
      </div>
    </div>
  </div>
</template>

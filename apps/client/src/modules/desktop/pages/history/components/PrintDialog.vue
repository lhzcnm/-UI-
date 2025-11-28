<script setup lang="ts">
import { HISTORY_STORE } from '../utils'

interface PrintDialogEmits {
  confirm: [],
}

const store = inject(HISTORY_STORE)!

const { t } = useI18n()
const paperSize = ref<string>('')

const emits = defineEmits<PrintDialogEmits>()

const paperSizes = [
  { label: '30 x 15 mm', value: '30x15' },
  { label: '30 x 20 mm', value: '30x20' },
  { label: '50 x 30 mm', value: '50x30' },
  // { label: 'A3 (297 × 420 mm)', value: '297x420' },
  // { label: 'A4 (210 × 297 mm)', value: '210x297' },
  // { label: 'A5 (148 × 210 mm)', value: '148x210' },
  // { label: 'B5 (176 × 250 mm)', value: '176x250' },
  // { label: 'Letter (216 × 279 mm)', value: '216x279' },
  // { label: 'Legal (216 × 356 mm)', value: '216x356' }
]

function handleCancel() {
  paperSize.value = ''
  store.visiblePrint = false
}

function handleConfirm() {
  const sizeArr = paperSize.value.split('x')

  store.paperSize.labelWidth = sizeArr[0]
  store.paperSize.labelHeight = sizeArr[1]

  emits('confirm')
  handleCancel()
}
</script>

<template>
  <XDialog
    v-model="store.visiblePrint"
    :title="t('order.print.title')"
    @close="handleCancel"
  >
    <template #default>
      <div class="space-y-4">
        <label class="text-sm font-medium">
          {{ t('order.print.paper') }}
        </label>
      
        <!-- <select
          v-model="paperSize"
          class="w-full border rounded-lg p-2 bg-white dark:bg-gray-800 dark:border-gray-700"
        >
          <option
            v-for="item in paperSizes"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </option>
        </select> -->
        <XSelect
          v-model="paperSize"
        >
          <XSelectItem
            v-for="size in paperSizes" :key="size.value"
            :label="size.label" :value="size.value"
          />
        </XSelect>
      </div>
    </template>
    
    <template #footer>
      <div class="mt-2 flex justify-end space-x-2">
        <!-- <XButton variant="soft" :label="t('button.cancel')" /> -->
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="handleCancel" @confirm="handleConfirm"
        />
      </div>
    </template>
  </XDialog>
</template>

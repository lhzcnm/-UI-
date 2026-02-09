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
]

function handleCancel() {
  paperSize.value = ''
  store.visiblePrint = false
}

function handleConfirm() {
  if (!paperSize.value) return
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
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="handleCancel" @confirm="handleConfirm"
        />
      </div>
    </template>
  </XDialog>
</template>

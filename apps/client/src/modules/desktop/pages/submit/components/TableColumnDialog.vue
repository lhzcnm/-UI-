<script setup lang="ts">
import type { ServiceCols } from '@/api/services'
import { SUBMIT_STORE } from '../utils'

interface TableColumnDialogEmits {
  (e: 'confirm', headers: ServiceCols[]): void
}

const store = inject(SUBMIT_STORE)!
const localStore = useLocalStore()

const emit = defineEmits<TableColumnDialogEmits>()

const filteredHeaders = ref<string[]>([])

const serviceHeaders = computed(() => {
  return store.serviceCols.map(item => item.key)
})

const allSelected = computed(() => {
  return (
    serviceHeaders.value.length > 0 &&
    serviceHeaders.value.every(item =>
      filteredHeaders.value.includes(item)
    )
  )
})

watch(
  () => store.visibleHeaderFilter,
  (visible) => {
    if (visible) {
      filteredHeaders.value = [...store.selectHeaders]
    }
  }
)

function toggleVal(val: string) {
  const idx = filteredHeaders.value.findIndex(v => v === val)
  if (idx !== -1) filteredHeaders.value.splice(idx, 1)
  else filteredHeaders.value.push(val)
}

function toggleAll(e: Event) {
  const target = e.target as HTMLInputElement

  if (target.checked) {
    serviceHeaders.value.forEach(item => {
      if (!filteredHeaders.value.includes(item)) {
        filteredHeaders.value.push(item)
      }
    })
  } else {
    filteredHeaders.value = filteredHeaders.value.filter(val => !serviceHeaders.value.includes(val))
  }
}

function handleConfirm() {
  store.selectHeaders = [...filteredHeaders.value]

  const headers = store.serviceCols.filter(item => {
    const name = item.key
    return filteredHeaders.value.includes(name)
  })

  emit('confirm', headers)
  store.visibleHeaderFilter = false
}

function handleClose() {
  filteredHeaders.value = store.selectHeaders
  store.visibleHeaderFilter = false
}
</script>

<template>
  <XDialog
    v-model="store.visibleHeaderFilter"
    :title="localStore.localData['submit_FieldsDialog']"
    @close="handleClose">
    <template #default>
      <div class="filter-modal">    
        <div class="flex flex-col gap-1 mb-4 max-h-64 overflow-auto">
          <label
            class="flex items-center gap-2">
            <input
              type="checkbox"
              value="all"
              :checked="allSelected"
              @change="toggleAll" />
              <span>{{ localStore.localData['submit_FieldsDialogAll'] }}</span>
          </label>
          <div class="grid grid-cols-3 space-y-2">
            <label
              v-for="item in store.serviceCols"
              :key="item.key"
              class="flex items-center gap-2"
            >
              <input
                type="checkbox"
                :value="item"
                :checked="filteredHeaders.includes(item.key)"
                @change="toggleVal(item.key)"
              />
              <span>{{ item.title }}</span>
            </label>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <XButton variant="soft" :label="localStore.localData['submit_FieldsDialogCancel']" @click="handleClose" />
        <XButton :label="localStore.localData['submit_FieldsDialogConfirm']" @click="handleConfirm" />
      </div>
    </template>
  </XDialog>
</template>

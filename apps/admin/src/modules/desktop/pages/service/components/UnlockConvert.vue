<script setup lang="ts">
import type { Unlock } from '@/inters/services'
import { updateUnlock } from '@/api/services'
import { UNLOCK_STORE } from '../utils'

const store = inject(UNLOCK_STORE)!

const loading = ref(false)
const convertCodes = ref<Unlock['convertCode']>([])
const selectedItems = ref<boolean[]>([])

watch(
  () => store.visibleConvert,
  (value) => {
    if (!value) return

    const carry = store.unlocks[store.index!].convertCode
    if (carry && carry.length) {
      convertCodes.value = JSON.parse(JSON.stringify(carry))
    }
    else {
      convertCodes.value = [
        { key: '', value: ''}
      ]
    }

    fillSelectedState(false)
  },
)

const isAllSelected = computed(() =>
  selectedItems.value.length > 0 &&
  selectedItems.value.every(item => item)
)

function toggleSelectAll() {
  fillSelectedState(!isAllSelected.value)
}

function handleSubmit() {
  loading.value = true

  const filtered = convertCodes.value.filter(item => item.key)
  const response = updateUnlock({
    id: store.unlocks[store.index!].id,
    convertCode: filtered,
  })

  response.then(() => {
    store.unlocks[store.index!] = {
      ...store.unlocks[store.index!],
      convertCode: filtered,
    }

    store.visibleConvert = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleCreate() {
  convertCodes.value.unshift({ key: '', value: '' })
  fillSelectedState(false)
}

function handleDelete() {
  const filtered = convertCodes.value
    .filter((_, index) => !selectedItems.value[index])

  convertCodes.value = filtered
  if (filtered.length === 0) {
    convertCodes.value.push({ key: '', value: '' })
  }
  
  fillSelectedState(false)
}

function fillSelectedState(state = false) {
  selectedItems.value = new Array(convertCodes.value.length).fill(state)
}
</script>

<template>
  <XDialog
    v-model="store.visibleConvert"
    ui-root="sm:max-w-2xl"
    title="设置转换码"
    draggable
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <input 
          type="checkbox" 
          id="select-all" 
          class="size-4" 
          :checked="isAllSelected"
          @change="toggleSelectAll"
        />
        <label for="select-all" class="text-sm">全选</label>
      </div>
      <div class="flex items-center space-x-2">
        <XButton label="增加转换码" @click="handleCreate" />
        <XButton label="删除" color="danger" @click="handleDelete" />
      </div>
    </div>
    <div class="mt-3 pr-1 space-y-3 overflow-y-auto max-h-[500px]">
      <div
        v-for="(item, index) in convertCodes" :key="index"
        class="flex items-start space-x-3"
      >
        <input
          v-model="selectedItems[index]"
          type="checkbox" class="size-4 mt-1"
        />
        <div class="flex-1">
          <label class="block text-sm mb-1">原始码</label>
          <XInput v-model="item.key" placeholder="原始码" />
        </div>
        <div class="flex-1">
          <label class="block text-sm mb-1">转换码</label>
          <XInput v-model="item.value" placeholder="转换码" />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton label="取消" variant="soft" @click="store.visibleConvert = false" />
        <XButton label="确定" :loading="loading" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

<script setup lang="ts">
import type { Unlock } from '@/inters/services'
import { updateUnlock } from '@/api/services'
import { UNLOCK_STORE } from '../utils'

const store = inject(UNLOCK_STORE)!

const loading = ref(false)
const convertCodes = ref<Unlock['convertCode']>([])

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
  },
)

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
}

function handleDelete(index: number) {
  if (convertCodes.value.length > 1) {
    convertCodes.value.splice(index, 1)
  }
}
</script>

<template>
  <TheModal
    v-model="store.visibleConvert"
    title="设置转换码"
  >
    <div class="p-4 pt-0 border-b border-dashed">
      <XButton label="增加转换码" @click="handleCreate" />
    </div>
 
    <div class="space-y-3 p-4">
      <div
        v-for="(item, index) in convertCodes" :key="index"
        class="border rounded-lg overflow-hidden"
      >
        <div class="p-3">
          <div class="mb-2">
            <label class="block text-sm text-label mb-1">原始码</label>
            <XInput v-model="item.key" placeholder="原始码" />
          </div>
          <div>
            <label class="block text-sm text-label mb-1">转换码</label>
            <XInput v-model="item.value" placeholder="转换码" />
          </div>
        </div>

        <div class="flex items-center justify-end px-3 py-2 border-t border-dashed bg-muted">
          <XButton
            v-if="convertCodes.length > 1"
            size="sm"
            color="danger"
            label="删除"
            @click="handleDelete(index)"
          />
        </div>
      </div>
    </div>

    <div class="sticky bottom-0 bg-card border-t flex justify-end space-x-2 p-4">
      <XButton label="取消" variant="soft" @click="store.visibleConvert = false" />
      <XButton label="确定" :loading="loading" @click="handleSubmit" />
    </div>
  </TheModal>
</template>

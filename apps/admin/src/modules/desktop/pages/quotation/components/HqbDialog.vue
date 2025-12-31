<script setup lang="ts">
import { type FormMode } from '@3un/shared'
import { toast } from 'vue-sonner'

import { QUOTATION_STORE } from '../utils'
import { options } from '../utils/dialog'
import { validate, type ValidRule } from '@/utils'
import { createQuotation, updateQuotation } from '@/utils/quotation/fn'
import HqbForm from './HqbForm.vue'

const store = inject(QUOTATION_STORE)!

const isCreate = computed(() => store.id == undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

// const form = reactive<FeiyangCreateForm>(zFeiyangForm.parse({}))

const loading = ref<boolean>(false)

function getRules() {
  const { model, memory, price, statusDesc, colorDesc } = store.formBase

  const rules: ValidRule[] = [
    { rule: !!model, message: '设备型号不能为空' },
    { rule: !!memory, message: '设备容量不能为空' },
    { rule: !!price, message: '基本价格不能为空' },
    { rule: price !== 0, message: '价格不能为0' },
    { rule: !!statusDesc, message: '设备状态不能为空' },
    { rule: !!colorDesc, message: '设备颜色不能为空' },
  ]

  return rules
}

function handleSubmit() {
  const rules = getRules()
  if(!validate(rules)) return

  loading.value = true
  if(isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  createQuotation(store.category, store.formBase).then(() => {
    toast.success('新增成功')
    store.refresh = !store.refresh
    store.visibleBase = false
  }).catch(() => {
    toast.warning("添加失败, 请重试")
  }).finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  updateQuotation(store.category, { id: store.id, ...store.formBase }).then(() => {
    toast.success('保存成功')
    store.refresh = !store.refresh
    store.visibleBase = false
  }).catch(() => {
    toast.warning('添加失败, 请重试')
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <XDialog
    v-model="store.visibleBase"
    :title="options[mode].title"
    :mask-closable="false"
    draggable
    ui-root="sm:max-w-sm sm:p-0"
    ui-header="p-4 mb-0 border-b"
  >
    <template #default>
      <HqbForm v-model="store.formBase" :colors="store.colors" :statuses="store.deviceStatuses"  />
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2 p-4 border-t">
        <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDialog>
</template>

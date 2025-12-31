<script setup lang="ts">
import type { FormMode } from '@3un/shared'
import { REMARK_STORE } from '../utils'
import { options } from '../utils/dialog'
import { validate, type ValidRule } from '@/utils'
import { createRemark, updateRemark } from '@/api/quotation'
import { toast } from 'vue-sonner'
import RemarkForm from './RemarkForm.vue'

const store = inject(REMARK_STORE)!

const isCreate = computed(() => store.id == undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const loading = ref<boolean>(false)

function getRules() {
  const { remark, remarkLocal } = store.formBase

  const rules: ValidRule[] = [
    {
      rule: !!remark, message: '请输入正确的备注信息',
    },
    {
      rule: !!remarkLocal, message: '请输入正确的英文备注信息',
    },
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
  loading.value = true
  createRemark(store.formBase).then(() => {
    toast.success('创建成功')
    store.visibleBase = false
    store.refresh = !store.refresh
  }).catch(() => {
    toast.warning("添加失败, 请重试")
  }).finally(() => {
    loading.value = false
  })

}
function handleUpdate() {
  loading.value = true
  updateRemark({ ...store.formBase, id: store.id! }).then(() => {
    toast.success('创建成功')
    store.visibleBase = false
    store.refresh = !store.refresh
  }).catch(() => {
    toast.warning("添加失败, 请重试")
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
      <RemarkForm :brands="store.brands" v-model="store.formBase" />
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2 p-4 border-t">
        <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDialog>
</template>

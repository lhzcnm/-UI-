<script setup lang="ts">
import { type FormMode } from '@3un/shared'
import { QUOTATION_STORE } from '../utils'
import { options } from '../utils/dialog'
import { zFeiyangForm, type FeiyangCreateForm } from '@/inters/quotation/feiyang'
import { validate, type ValidRule } from '@/utils'

const store = inject(QUOTATION_STORE)!

const isCreate = computed(() => store.id == undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const form = reactive<FeiyangCreateForm>(zFeiyangForm.parse({}))

const loading = ref<boolean>(false)

function getRules() {
  const { model, memory, price, appearanceDesc } = form

  const rules: ValidRule[] = [
    { rule: !!model, message: '设备型号不能为空' },
    { rule: !!memory, message: '设备容量不能为空' },
    { rule: !!price, message: '基本价格不能为空' },
    { rule: price !== 0, message: '价格不能为0' },
    { rule: !!appearanceDesc, message: '设备状态错误' }
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

}

function handleUpdate() {}
</script>

<template>
  <XDialog
    v-model="store.visibleBase"
    :title="options[mode].title"
    :mask-closable="false"
    draggable
    ui-root="sm:max-w-lg sm:p-0"
    ui-header="p-4 mb-0 border-b"
  >
    <template #default>
      <form class="divide-y p-4" @submit.prevent>
        <FormField label="设备型号" desc="设备型号">
          <XInput placeholder="设备型号" v-model="form.model" />
        </FormField>
        <FormField label="设备容量" desc="设备容量">
          <XInput placeholder="设备容量" v-model="form.memory" />
        </FormField>
        <FormField label="设备价格" desc="设备价格">
          <XInputNumber v-model="form.price" :precision="0.02" />
        </FormField>
        <FormField label="设备状态" desc="设备状态">
          <XInput placeholder="设备状态" v-model="form.appearanceDesc" />
        </FormField>
      </form>
    </template>

    <template #footer>
      <div class="flex justify-end space-x-2 p-4 border-t">
        <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
        <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
      </div>
    </template>
  </XDialog>
</template>

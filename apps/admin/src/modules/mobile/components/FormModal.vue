<script setup lang="ts">
import TheModal from './TheModal.vue'
import type { FormMode } from '@3un/shared'

interface TheDialogProps {
  flag?: string
  index: number | undefined
  validate?: () => boolean
  update   : () => Promise<any>
  create   : () => Promise<any>
}

const props = defineProps<TheDialogProps>()
const visible = defineModel<boolean>({ required: true })
const loading = ref(false)
const label = props.flag || ''

const options = {
  create: {
    title: `新增${label}`,
    submitText: '新增',
  },
  update: {
    title: `${label}编辑`,
    submitText: '保存',
  },
}

const isCreate = computed(() => props.index === undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

function handleSubmit() {
  if (props.validate && !props.validate()) return

  loading.value = true
  let response: Promise<any>

  if (isCreate.value) response = props.create()
  else response = props.update()

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <TheModal
    v-model="visible"
    :title="options[mode].title"
    v-bind="$attrs"
  >
    <slot></slot>
    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" @click="visible = false">取消</XButton>
      <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
    </div>
  </TheModal>
</template>

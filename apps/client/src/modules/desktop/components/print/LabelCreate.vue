<script setup lang="ts">
import { useCopyFn } from '@3un/utils'
import LabelCreateFormVue from './form/LabelCreateForm.vue'

import { validate, type ValidRule } from '@/utils'
import { initForm, type LabelCreateForm } from '@/types/print'

interface LabelCreateEmits {
  create: [template: LabelCreateForm]
}

// const store = inject(STORE)!
const visible = defineModel<boolean>({ required: true })

const clone = useCopyFn(() => initForm)
const copied = ref<LabelCreateForm>(clone())
const localStore = useLocalStore()

const emits = defineEmits<LabelCreateEmits>()

watch(
  () => visible.value,
  (val) => val && (copied.value = clone())
)

function getRules() {
  const { label, value } = copied.value

  const rules: ValidRule[] = [
    { rule: !!label, message: "请输入正确的标签名" },
    { rule: !!value, message: "请输入正确的标签内容" },
  ]

  return rules
}

function handleCancel() {
  visible.value = false
}

function handleCreate() {
  if (!validate(getRules())) return

  handleCancel()
  emits('create', copied.value)
}
</script>

<template>
  <XDialog
    v-model="visible"
    :title="localStore.localData['print_CustomLabelTitle']"
    ui-root="sm:p-0"
    ui-header="p-4 border-b"
  >
    <template #default>
      <LabelCreateFormVue class="p-4" v-model="copied" />
    </template>

    <template #footer>
      <div class="p-4 flex items-center justify-end gap-2">
        <XButton variant="soft" :label="localStore.localData['print_CancelButtonDialog']" @click="handleCancel" />
        <XButton :label="localStore.localData['print_AddButtonDialog']" @click="handleCreate" />
      </div>
    </template>
  </XDialog>
</template>

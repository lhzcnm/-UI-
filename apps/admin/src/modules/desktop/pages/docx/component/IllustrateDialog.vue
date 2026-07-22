<script setup lang="ts">
import IllustrateForm from './IllustrateForm.vue'

import { toast } from 'vue-sonner'
import { createFormData } from '@3un/utils'

import { buildIllustrateBody, getCodeImages } from '@/utils/illustrate.ts'
import { DOCX_STORE } from '../utils'
import { zIllustrate, type IllustrateSubmitForm } from '@/inters/illustrate/index.ts'
import { updateIllustrate } from '@/api/illustrate.ts'
import { validate, type ValidRule } from '@/utils/validate'

const store = inject(DOCX_STORE)!

const mode = {
  create: {
    title: '新增',
    confirmText: '新增'
  },
  update: {
    title: '编辑',
    confirmText: '保存'
  }
}

const option = computed(() => store.index !== undefined ? 'update' : 'create')
const currentMode = computed(() => mode[option.value])
const disableEditCode = computed(() => option.value !== 'create')

function getRules() {
  const { serviceCode } = store.formBase

  const rules: ValidRule[] = [
    { rule: !!serviceCode, message: '请输入模块名' }
  ]

  return rules
}

async function handleSubmit() {
  if (option.value === 'update') {
    await handleUpdate()
  } else {
    await handleCreate()
  }
}

async function handleCreate() {
  if (!validate(getRules())) return

  const illustrateItem = zIllustrate.parse(store.formBase)
  const submitBody = await buildIllustrateBody(illustrateItem, [])

  // console.log(submitBody)

  try {
    await confirmUpdate(submitBody)
    toast.success('添加成功')
    store.visibleBase = false
  } catch {}
}

async function handleUpdate() {
  const illustrateItem = zIllustrate.parse(store.formBase)
  const images = await getCodeImages(illustrateItem.serviceCode)

  const body = await buildIllustrateBody(illustrateItem, images)

  try {
    await confirmUpdate(body)
    toast.success('更新成功')
    store.visibleBase = false
  } catch {}
}

async function confirmUpdate(body: IllustrateSubmitForm) {
  const formdata = createFormData(body)

  await updateIllustrate(formdata)

  store.refresh = !store.refresh
}
</script>

<template>
  <XDialog
    v-model="store.visibleBase"
    :title="currentMode.title"
    ui-root="sm:p-0 sm:max-w-xl"
    ui-header="p-4 border-b"
  >
    <template #default>
      <IllustrateForm class="px-4 pb-4" v-model="store.formBase" :disableEditCode />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end gap-2">
        <XButton label="取消" variant="soft" @click="store.visibleBase = false" />
        <XButton label="确认" @click="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>

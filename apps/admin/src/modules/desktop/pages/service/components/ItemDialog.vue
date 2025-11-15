<script setup lang="ts">
import ItemForm from './ItemForm.vue'

import type { FormMode } from '@3un/shared'
import { xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'

import type { ServiceCreateParams } from '@/inters/services'
import { createService, deleteService, resetServicePrice, updateService } from '@/api/services'

import { validate, type ValidRule } from '@/utils'
import { SERVICE_STORE } from '../utils'

const options = {
  create: {
    title: '新增服务',
    submitText: '新增',
  },
  update: {
    title: '编辑服务',
    submitText: '保存',
  },
}

const store = inject(SERVICE_STORE)!
const serviceStore = useServiceStore()

const isCreate = computed(() => store.index === undefined)
const mode = computed<FormMode>(() => isCreate.value ? 'create' : 'update')

const loading = ref(false)

function getRules(form: ServiceCreateParams) {
  const {
    tmpTitle, packageTitle, packageTitleLocal,
    packagePrice, timeTaken, timeTakenLocal
  } = form

  return [
    { rule: !!tmpTitle, message: '服务简写不能为空' },
    { rule: !!packageTitle, message: '服务名称不能为空' },
    { rule: !!packageTitleLocal, message: '服务名称(EN)不能为空' },
    { rule: !!packagePrice, message: '服务价格不能为0' },
    { rule: !!timeTaken, message: '处理时间不能为空' },
    { rule: !!timeTakenLocal, message: '处理时间(EN)不能为空' },
  ] as ValidRule[]
}

function handleSubmit() {
  const rules = getRules(store.formBase)
  if (!validate(rules)) return

  loading.value = true
  if (isCreate.value) handleCreate()
  else handleUpdate()
}

function handleCreate() {
  const response = createService(store.formBase)

  response.then((data) => {
    serviceStore.items.push(data)
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

function handleUpdate() {
  const item = serviceStore.items[store.index!]
  const body = { ...store.formBase, packageId: item.packageId }

  const response = updateService(body)

  response.then(() => {
    serviceStore.items[store.index!] = body
    store.visibleBase = false
  })

  response.finally(() => {
    loading.value = false
  })
}

async function handleDelete() {
  if (!await xconfirm('确定要删除该服务吗？')) return

  const item = serviceStore.items[store.index!]
  deleteService(item.packageId).then(() => {
    serviceStore.items.splice(store.index!, 1)
    store.visibleBase = false
  })
}

async function handleResetPrice() {
  const item = serviceStore.items[store.index!]
  await resetServicePrice(item.packageId)
  toast.success('重置服务价格成功')
}
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
    <ItemForm
      v-model="store.formBase"
      :is-create="isCreate"
      :reset-price="handleResetPrice"
      class="max-h-[75vh] p-4 overflow-y-auto"
    />
    <template #footer>
      <div class="flex justify-between p-4 border-t">
        <XButton
          v-show="!isCreate"
          color="danger"
          icon="lucide:trash-2"
          @click="handleDelete"
        >
          删除服务
        </XButton>

        <div class="ml-auto space-x-2">
          <XButton variant="soft" @click="store.visibleBase = false">取消</XButton>
          <XButton :loading @click="handleSubmit">{{ options[mode].submitText }}</XButton>
        </div>
      </div>
    </template>
  </XDialog>
</template>

<script setup lang="ts">
import ProductImportForm from './forms/ProductImportForm.vue'

import { toast } from 'vue-sonner'
import type { ValidRule } from '@/inters/basic/valid'
import { createFormData } from '@3un/utils'

import { HOME_STORE } from '../utils'
import { validate } from '@/utils/common'
import { importCreateHistory, importUpdateRecord } from '@/api/product'
import { zProductSearch, type ProductImport } from '@/inters/product'

const store = inject(HOME_STORE)!

const router = useRouter()

const loading = ref<boolean>(false)

const isExcel = computed(() => store.importType === 'excel')

function getRules() {
  const { file, sku, description, grade, quantity, offer } = store.formImport

  const rules: ValidRule[] = [
    {
      rule: file.size > 0,
      message: '请选择文件',
    },
    {
      rule: !!sku,
      message: '请填写SKU匹配字段',
    },
    {
      rule: !!description,
      message: '请填写型号字段',
    },
    {
      rule: !!grade,
      message: '请填写等级字段',
    },
    {
      rule: !!quantity,
      message: '请填写数量字段',
    },
    {
      rule: !!offer,
      message: '请填写报价字段',
    },
  ]

  return rules
}

async function handleSubmit() {
  if (!validate(getRules())) return

  if (isExcel.value) excelImport(store.formImport)
  else updateImport(store.formImport)
}

async function updateImport(body: ProductImport) {
  try {
    loading.value = true
    await importUpdateRecord(createFormData(body))
    loading.value = false
    toast.success('更新成功')
    store.visibleImport = false
    store.formSearch = zProductSearch.parse({})
    store.page = 1
    store.refresh = !store.refresh
  } catch {} finally {
    loading.value = false
  }
}

async function excelImport(body: ProductImport) {
  try {
    loading.value = true
    const data = await importCreateHistory(createFormData(body))
    toast.success('导入成功')
    store.visibleImport = false
    router.push(`/history/${data}`)
  } catch {} finally {
    loading.value = false
  }
}
</script>

<template>
  <XDialog v-model="store.visibleImport"
    title="导入"
    draggable
    ui-root="sm:p-0 sm:max-w-lg"
    ui-header="p-4 border-b">
    <template #default>
      <ProductImportForm class="p-4 border-b" v-model="store.formImport" />
    </template>

    <template #footer>
      <div class="p-4 flex justify-end items-center space-x-2">
        <XButton label="取消" variant="soft" @click="store.visibleImport = false" :loading="loading" />
        <XButton label="导入" @click="handleSubmit" :loading="loading" />
      </div>
    </template>
  </XDialog>
</template>

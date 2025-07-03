<script setup lang="ts">
import PackageForm from './PackageForm.vue'
import { createRechargePackage, updateRechargePackage } from '@/api/recharge'
import { PACKAGE_STORE } from '../utils'

const store = inject(PACKAGE_STORE)!
const formRef = useTemplateRef('formRef')

async function handleCreate() {
  const price = store.formBase.price.toString() as unknown as number
  const body = { ...store.formBase, price }
  const data = await createRechargePackage(body)
  store.packages.push(data)
  store.visibleBase = false
}

async function handleUpdate() {
  const item = store.packages[store.index!]
  const price = store.formBase.price.toString() as unknown as number
  const body = { ...store.formBase, price, id: item.id }

  await updateRechargePackage(body)
  store.packages[store.index!] = {
    ...body,
    createTime: item.createTime,
    price: price.toString(),
  }

  store.visibleBase = false
}
</script>

<template>
  <FormDialog
    v-model="store.visibleBase"
    :index="store.index"
    :update="handleUpdate"
    :create="handleCreate"
    :validate="formRef?.validateForm"
    @close="formRef?.clearErrors"
  >
    <PackageForm ref="formRef" v-model="store.formBase" />
  </FormDialog>
</template>

<script setup lang="ts">
import PackageForm from './PackageForm.vue'
import { createRechargePackage, updateRechargePackage } from '@/api/recharge'
import { PACKAGE_STORE } from '../utils'
import { PLAN_TYPE_ENUM } from '@/utils/enum.ts'

const store = inject(PACKAGE_STORE)!
const formRef = useTemplateRef('formRef')

const levelStore = useLevelStore()

const levels = computed(() => levelStore.levels.filter(l => l.upgradeType !== PLAN_TYPE_ENUM.GRANDTOTAL))

watch(
  () => store.visibleBase,
  () => {
    store.formBase.planId = levels.value.length > 0 ? levels.value[0].pricePlanId : 0
  }
)

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
  <FormModal
    v-model="store.visibleBase"
    class="h-[70%]"
    :index="store.index"
    :update="handleUpdate"
    :create="handleCreate"
    :validate="formRef?.validateForm"
    @close="formRef?.clearErrors"
  >
    <PackageForm
      v-model="store.formBase"
      ref="formRef" class="px-4"
    />
  </FormModal>
</template>

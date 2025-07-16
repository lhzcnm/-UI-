<script setup lang="ts">
import PackageDialog from './components/PackageDialog.vue'
import { zRechargePackageForm } from '@/inters/recharge'

import type { PackageStore } from './utils'
import { columns } from './utils/columnPackage'
import { PACKAGE_STORE } from './utils'
import { getRechargePackages } from '@/api/recharge'

const levelStore = useLevelStore()
await levelStore.getList()

const store: PackageStore = reactive({
  packages: await getRechargePackages(),
  
  formBase: zRechargePackageForm.parse({}),
  visibleBase: false,

  refresh: false,
  index  : undefined,
})

provide(PACKAGE_STORE, store)

function openCreate() {
  store.formBase = zRechargePackageForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <XButton icon="lucide:plus" label="添加套餐" @click="openCreate" />
    </section>

    <div class="p-3 pb-0">
      <XTable
        :columns="columns"
        :data="store.packages" row-key="id"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <PackageDialog />
  </div>
</template>

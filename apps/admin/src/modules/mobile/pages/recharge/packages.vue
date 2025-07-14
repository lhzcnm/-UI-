<script setup lang="ts">
import PackageModal from './components/PackageModal.vue'
import PackageCard from './components/PackageCard.vue'

import { zRechargePackageForm } from '@/inters/recharge'
import { getRechargePackages } from '@/api/recharge'

import type { PackageStore } from './utils'
import { PACKAGE_STORE } from './utils'

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
    <section class="flex justify-between px-3 py-2 bg-card border-b">
      <XButton icon="lucide:plus" label="添加套餐" @click="openCreate" />
    </section>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <PackageCard
        v-for="(item, index) in store.packages"
        :key="item.id" :item="item" :index="index"
      />
    </section>

    <PackageModal />
  </div>
</template>

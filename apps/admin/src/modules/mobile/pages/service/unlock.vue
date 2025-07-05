<script setup lang="ts">
import UnlockCard from './components/UnlockCard.vue'
import UnlockModal from './components/UnlockModal.vue'
import UnlockConvert from './components/UnlockConvert.vue'

import { zUnlockForm } from '@/inters/services'
import { getUnlockList } from '@/api/services'

import { UNLOCK_STORE, type UnlockStore } from './utils'

const store: UnlockStore = reactive({
  unlocks: [],

  formBase: zUnlockForm.parse({}),

  visibleBase: false,
  visibleConvert: false,

  index: undefined,
})

provide(UNLOCK_STORE, store)

await getList()
async function getList() {
  store.unlocks = await getUnlockList()
}

function openCreate() {
  store.formBase = zUnlockForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <section class="px-3 py-2 bg-card border-b">
      <XButton
        icon="lucide:circle-plus"
        label="新增" @click="openCreate"
      />
    </section>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <UnlockCard
        v-for="(item, index) in store.unlocks"
        :key="item.id" :item="item" :index="index"
      />
    </section>

    <UnlockModal />
    <UnlockConvert />
  </div>
</template>

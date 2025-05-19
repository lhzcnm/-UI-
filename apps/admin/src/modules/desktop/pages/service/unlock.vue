<script setup lang="ts">
import UnlockForm from './components/UnlockForm.vue'
import UnlockConvert from './components/UnlockConvert.vue'
import { columns } from './utils/columnUnlock'

import { zUnlockForm } from '@/inters/services'
import { getUnlockList } from '@/api/services'

import type { UnlockStore } from './utils'
import { UNLOCK_STORE } from './utils'

const store: UnlockStore = reactive({
  formBase: zUnlockForm.parse({}),
  visibleBase: false,
  visibleConvert: false,
  index: undefined,
  unlocks: [],
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
    <section class="p-3 border-b">
      <XButton
        icon="lucide:circle-plus"
        label="新增" @click="openCreate"
      />
    </section>

    <div class="p-3">
      <XTable
        :data="store.unlocks"
        :columns="columns"
        row-key="id"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <UnlockForm />
    <UnlockConvert />
  </div>
</template>

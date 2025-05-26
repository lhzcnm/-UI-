<script setup lang="ts">
import LevelDialog from './components/LevelDialog.vue'
import { zLevelForm } from '@/inters/level'

import type { LevelStore } from './utils'
import { LEVEL_STORE } from './utils'

import { columns } from './utils/columnLevel'

const levelStore = useLevelStore()
await levelStore.getList(true)

const store: LevelStore = reactive({
  formBase: zLevelForm.parse({}),
  visibleBase: false,
  index: undefined,
})

provide(LEVEL_STORE, store)

function openCreate() {
  store.formBase = zLevelForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <section class="p-3 border-b">
      <XButton
        color="success" icon="lucide:plus"
        label="新增等级" @click="openCreate"
      />
    </section>

    <div class="p-3">
      <XTable
        :columns="columns"
        :data="levelStore.levels"
        row-key="pricePlanId"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <LevelDialog />
  </div>
</template>

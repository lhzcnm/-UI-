<script setup lang="ts">
import LevelCard from './components/LevelCard.vue'
import LevelModal from './components/LevelModal.vue'
import LevelService from './components/LevelService.vue'

import { zLevelForm, zLevelServiceForm } from '@/inters/level'

import type { LevelStore } from './utils'
import { LEVEL_STORE } from './utils'

const levelStore = useLevelStore()
await levelStore.getList(true)

const store: LevelStore = reactive({
  services: [],

  formBase: zLevelForm.parse({}),
  formService: zLevelServiceForm.parse({}),

  visibleBase: false,
  visibleService: false,

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
    <section class="px-3 py-2 bg-card border-b">
      <XButton
        color="success" icon="lucide:plus"
        label="新增等级" @click="openCreate"
      />
    </section>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-3 p-3">
      <LevelCard
        v-for="(level, index) in levelStore.levels"
        :key="level.pricePlanId"
        :level="level" :index="index"
      />
    </section>

    <LevelModal />
    <LevelService />
  </div>
</template>

<script setup lang="ts">
import GroupModal from './components/GroupModal.vue'
import GroupCard from './components/GroupCard.vue'

import { zServiceGroupForm } from '@/inters/services'
import { GROUP_STORE, type ServiceGroupStore } from './utils'

const serviceStore = useServiceStore()
const store: ServiceGroupStore = reactive({
  formBase: zServiceGroupForm.parse({}),
  visibleBase: false,
  index: undefined,
})

provide(GROUP_STORE, store)

function openCreate() {
  store.formBase = zServiceGroupForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <section class="flex justify-between px-3 py-2 bg-card border-b">
      <XButton icon="lucide:circle-plus" label="新增服务组" @click="openCreate" />
    </section>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <GroupCard
        v-for="(item, index) in serviceStore.groups"
        :key="item.categoryId" :item="item" :index="index"
      />
    </section>

    <GroupModal />
  </div>
</template>

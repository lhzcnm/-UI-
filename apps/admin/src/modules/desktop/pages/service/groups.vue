<script setup lang="ts">
import GroupForm from './components/groupForm.vue'

import { GROUP_STORE, type ServiceGroupStore } from './utils'
import { columns } from './utils/columnGroup'

import { zServiceGroup } from '@/inters/services'

const serviceStore = useServiceStore()
const store: ServiceGroupStore = reactive({
  form: zServiceGroup.parse({}),
  visible: false,
})

provide(GROUP_STORE, store)

function openCreate() {
  store.form = zServiceGroup.parse({})
  store.visible = true
}
</script>

<template>
  <div class="px-3">
    <section class="my-3">
      <XButton
        icon="lucide:circle-plus"
        @click="openCreate"
      >
        新增服务组
      </XButton>
    </section>

    <XTable
      :data="serviceStore.groups"
      :columns="columns"
      class="h-[calc(100vh-8rem)]"
    />

    <GroupForm />
  </div>
</template>

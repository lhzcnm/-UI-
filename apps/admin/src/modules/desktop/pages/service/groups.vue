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
  <div>
    <section class="flex justify-between p-3 border-b">
      <XButton icon="lucide:circle-plus" label="新增服务组" @click="openCreate" />
    </section>

    <div class="p-3">
      <XTable
        :data="serviceStore.groups"
        :columns="columns"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <GroupForm />
  </div>
</template>

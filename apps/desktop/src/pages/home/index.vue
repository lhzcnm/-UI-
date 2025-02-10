<script setup lang="ts">
import type { ServiceDetail } from '@3un/shared/services'
import ServiceItemCard from './components/ServiceItemCard.vue'
import ServiceGroupDialog from './components/ServiceGroupDialog.vue'
import { BulletinBoard } from '@3un/ui'

const sStore = useServiceStore()
const store = useSettingStore()

await Promise.all([
  sStore.getServices(),
  store.getSettings(),
])

const visible = ref(false)
const commonList = getCommonList()
const current = ref<ServiceDetail>({
  children: [],
  id: 0,
  name: '',
  nameEn: '',
})

function getCommonList() {
  const key = import.meta.env.VITE_RECENT_SERVICES
  const recentServices = localStorage.getItem(key)
  if (!recentServices) return sStore.services.filter(item => item.isHot)

  const commonList = JSON.parse(recentServices)
  return sStore.services.filter(item => commonList.includes(item.id))
}

function openGroupDialog(group: ServiceDetail) {
  current.value = group
  visible.value = true
}
</script>

<template>
  <div>
    <BulletinBoard
      v-if="store.settings.enableNotice"
      class="mb-4" :text="store.settings.noticeInfo"
    />

    <section class="grid gap-2 md:gap-4 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))]">
      <a
        v-for="group in sStore.serviceDetails"
        :key="group.id" href="javascript:void(0)"
        class="p-3 bg-card border hover:border-hover rounded-lg hover:shadow transition-colors"
        @click="openGroupDialog(group)"
      >
        <h3 class="font-bold">{{ group.name }}</h3>
        <span class="text-sm text-muted-foreground">
          共 {{ group.children.length }} 项服务
        </span>
      </a>
    </section>

    <section v-if="commonList.length" class="mt-8">
      <h2 class="text-xl font-bold mb-3">常用服务</h2>
      <div class="grid gap-2 md:gap-4 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))]">
        <ServiceItemCard
          v-for="item in commonList"
          :key="item.id" :data="item"
        />
      </div>
    </section>

    <ServiceGroupDialog
      v-model="visible"
      :group="current"
    />
  </div>
</template>

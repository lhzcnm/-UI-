<script setup lang="ts">
import type { ServiceDetail } from '@/api/services'
import PickService from './components/PickService.vue'

import { getCommonList } from '@/utils'

const sStore = useServiceStore()
const store = useSettingStore()

await Promise.all([
  sStore.getServices(),
  store.getSettings(),
])

const router = useRouter()
const visible = ref(false)
const current = ref<ServiceDetail>({
  id: 0,
  title: '',
  children: [],
})

const commonList = getCommonList(sStore.services)

function openGroupDialog(group: ServiceDetail) {
  current.value = group
  visible.value = true
}

function handleServiceItemClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  const element = target.closest('[data-id]')
 
  if (!element) return

  const dataId = element.getAttribute('data-id')
  const id = parseInt(dataId || '0')

  router.push(`/submit/${id}`)
}
</script>

<template>
  <div class="p-4">
    <XBulletinBoard
      v-if="store.settings.enableScrollingAnnc"
      class="mb-4" :text="store.settings.scrollingAnnc"
      :style="{ '--bg': 'hsl(var(--card))' }"
    />

    <section class="grid gap-2 md:gap-4 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))]">
      <ServiceGroupCard
        v-for="group in sStore.details"
        :key="group.id" :group="group"
        @click="openGroupDialog(group)"
      />
    </section>

    <section v-if="commonList.length" class="mt-8">
      <h2 class="text-xl font-bold mb-3">常用服务</h2>
      <div
        class="grid gap-2 md:gap-4 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))]"
        @click="handleServiceItemClick"
      >
        <ServiceItemCard
          v-for="item in commonList"
          :key="item.id" :data="item"
          :data-id="item.id"
        />
      </div>
    </section>

    <PickService
      v-model="visible"
      :group="current"
    />
  </div>
</template>

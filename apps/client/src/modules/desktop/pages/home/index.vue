<script setup lang="ts">
import type { ServiceDetail } from '@/api/services'
import PickService from './components/PickService.vue'

import { getCommonList } from '@/utils'

const store = useServiceStore()
const iStore = useSettingStore()

await Promise.all([
  store.getServices(),
  iStore.getSettings(),
])

const router = useRouter()

const defaultGroup = { id: 0, title: '', children: [] }
const current = ref<ServiceDetail>(defaultGroup)
const visible = ref(false)

const { popupAnnc, enablePopupAnnc } = iStore.settings
const visiblePopup = ref(enablePopupAnnc)

const commonList = getCommonList(store.services)

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
      v-if="iStore.settings.enableScrollingAnnc"
      class="mb-4" :text="iStore.settings.scrollingAnnc"
      :style="{ '--bg': 'hsl(var(--card))' }"
    />

    <section class="grid gap-2 md:gap-4 grid-cols-[repeat(auto-fill,minmax(280px,_1fr))]">
      <ServiceGroupCard
        v-for="group in store.details"
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

    <XDialog
      v-model="visiblePopup" title="公告"
      :text="popupAnnc" :close-btn="false"
    >
      <template #footer>
        <div class="flex justify-end">
          <XButton @click="visiblePopup = false">
            朕知道了
          </XButton>
        </div>
      </template>
    </XDialog>
  </div>
</template>

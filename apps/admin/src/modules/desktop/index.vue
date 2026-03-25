<script setup lang="ts">
import { getUpdateNote } from '@/api/settings'
import { xconfirm } from '@3un/utils'
import { useFullscreen } from '@vueuse/core'
import { twJoin } from 'tailwind-merge'

const route = useRoute()
const iStore = useSystemStore()
const { isFullscreen, toggle } = useFullscreen(document.documentElement)
const remindKey = "annc-remind"

const serviceStore = useServiceStore()
const levelStore = useLevelStore()
const remindVisible = ref<boolean>(true)

const isAdmin = import.meta.env.VITE_APP_ADMIN

await Promise.all([
  serviceStore.getItems(),
  serviceStore.getGroups(),
  levelStore.getList(),
  iStore.getSetting(),
  iStore.getThreads(),
  iStore.getConfig(),
  isAdmin === 'true' && iStore.getIllustrateList(),
])

iStore.startTodoTimer()

async function getRemind() {
  try {
    const data = await getUpdateNote()
    return data
  } catch {}
}

onMounted(async () => {
  const remindStorage = sessionStorage.getItem(remindKey)

  if (remindStorage === 'false') return

  const data = await getRemind()
  if (!data) return
  remindVisible.value = data.status

  if (!remindVisible.value) return
  
  const confirmed = await xconfirm({
    title: "更新公告",
    text: data.content,
    uiRoot: 'sm:max-w-xl'
  })

  if (confirmed) {
    remindVisible.value = false
    sessionStorage.setItem(remindKey, `${remindVisible.value}`)
  }
})

onUnmounted(() => iStore.stopTodoTimer())
</script>

<template>
  <div ref="root" class="h-screen">
    <Transition name="slide-left">
      <Sidebar
        v-if="iStore.showSidebar"
        :class="twJoin(
          'fixed top-0 left-0 z-20',
          'w-sidebar h-screen'
        )"
      />
    </Transition>

    <div
      class="bg-background"
      :class="{ 'ml-sidebar': iStore.showSidebar }"
    >
      <DesktopHeader
        :is-fullscreen="isFullscreen"
        :toggle-fullscreen="toggle"
      />
      <RouterView v-slot="{ Component }" :key="route.path">
        <main
          v-if="Component" ref="mainRef"
          class="h-container overflow-y-auto"
        >
          <Transition name="fade-in" mode="out-in">
            <Suspense>
              <component :is="Component" />

              <template #fallback>
                <Fallback />
              </template>
            </Suspense>
          </Transition>
        </main>
      </RouterView>
    </div>
  </div>
</template>

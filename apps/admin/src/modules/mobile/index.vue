<script setup lang="ts">
import { getUpdateNote } from '@/api/settings'
import Fallback from '@/components/Fallback.vue'
import { xconfirm } from '@3un/utils'
import { twJoin } from 'tailwind-merge'

const iStore = useSystemStore()
const route = useRoute()

const serviceStore = useServiceStore()
const levelStore = useLevelStore()
const remindKey = "annc-remind"

const remindVisible = ref<boolean>(true)

await Promise.all([
  serviceStore.getItems(),
  serviceStore.getGroups(),
  levelStore.getList(),
  iStore.getSetting(),
])

iStore.startTodoTimer()

async function getRemind() {
  try {
    const data = await getUpdateNote()
    return data
  } catch {}
}

// async function showRemind(data: string) {
//   if (!await xconfirm({ title: "更新公告", text: data })) return
//   localStorage.setItem(remindKey, "true")
// }


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
  <div class="flex flex-col h-screen">
    <MobileHeader />
    <RouterView v-slot="{ Component }" :key="route.path">
      <main
        v-if="Component"
        class="flex-1 overflow-y-auto bg-zinc-100 dark:bg-black"
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

    <Transition name="fade-in">
      <div
        v-if="iStore.showSidebar"
        class="fixed top-0 left-0 z-10 size-full bg-black/80"
        @click="iStore.showSidebar = false"
      />
    </Transition>
    <Transition name="slide-left">
      <Sidebar
        v-if="iStore.showSidebar"
        :class="twJoin(
          'fixed top-0 left-0 z-20 w-[75%]',
          'will-change-transform h-screen border-solid'
        )"
      />
    </Transition>
  </div>
</template>

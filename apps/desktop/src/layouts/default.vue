<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import SvgSpinnersPulse3       from '~icons/svg-spinners/pulse-3'
import IconoirHomeAltSlimHoriz from '~icons/iconoir/home-alt-slim-horiz'
import IconoirPageFlip         from '~icons/iconoir/page-flip'
import IconoirAtom             from '~icons/iconoir/atom'
import IconoirChatLines        from '~icons/iconoir/chat-lines'
import IconoirUser             from '~icons/iconoir/user'

const menus = [
  { label: '首页', path: '/', icon: IconoirHomeAltSlimHoriz },
  { label: '订单查询', path: '/submit', icon: IconoirAtom },
  { label: '我的订单', path: '/history', icon: IconoirPageFlip },
  { label: '我的工单', path: '/ticket', icon: IconoirChatLines },
  { label: '会员中心', path: '/profile', icon: IconoirUser },
]

const route = useRoute()
await useUserStore().getInfo()
</script>

<template>
  <TheHeader />
  <main class="pt-16">
    <Sidebar class="float-left w-sidebar mt-4" :menus />
    <RouterView v-slot="{ Component }" :key="route.path">
      <template v-if="Component">
        <Transition name="fade-in" mode="out-in">
          <Suspense>
            <div class="p-4 overflow-y-auto h-main">
              <component :is="Component" />
            </div>

            <template #fallback>
              <div class="flex items-center justify-center flex-col h-[50vh] text-6xl text-muted-foreground">
                <SvgSpinnersPulse3 />
                <span class="text-base mt-3">loading...</span>
              </div>
            </template>
          </Suspense>
        </Transition>
      </template>
    </RouterView>
  </main>
</template>

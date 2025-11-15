<script setup lang="ts">
import { useSystemStore } from '@/stores/system'
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import router from '@/router'

const uStore = useUserStore()
const systemStore = useSystemStore()
const { t } = useI18n()
const foldIcon = computed(() => {
  if(systemStore.showSidebar) return 'lucide:panel-left-close'
  return 'lucide:panel-left-open'
})

</script>

<template>
  <header class="w-full h-header px-4 bg-background">
    <div class="flex items-center justify-between h-full border-b border-dashed">
      <div class="flex items-center">
        <TheLogo />
        <Icon class="ml-16 text-zinc-500 cursor-pointer" width="24" :icon="foldIcon" @click="systemStore.toggleSidebar" />
        
      </div>

      <nav class="flex items-center space-x-4">
        <!-- 报价单按钮点击进入报价单 -->
        <div 
          @click="router.push('/quotation')"
          class="inline-block px-3 py-2  bg-gradient-to-r from-sky-400 via-purple-500 to-pink-500
                 text-white text-sm rounded-full shadow-lg 
                 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer
                 text-center select-none">
          {{ t('quote.QuoteButton.FreeQuote') }}
        </div>

        <RouterLink
          to="/recharge"
          :class="twJoin(
            'flex items-center space-x-2 px-3 py-2 shadow',
            'bg-success text-white rounded-full'
          )"
        >
          <Icon icon="hugeicons:bitcoin-bag" class="size-5" />
          <span class="text-sm">{{ uStore.info.credits }}</span>
        </RouterLink>

        <LanguageSwitch />
        <TheTheme />
        <TheAvatar class="size-8" />
        
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const { t } = useI18n()
import  {type QUOTE_STORE_TYPE,QUOTE_STORE } from '../../utils/store'
const realTime = ref(
  [
  { id: 1, label: t('quote.RealQuote.FarVision'), color: 'bg-gradient-to-br from-green-500/80 from-30% to-green-500/40 to-80%' },  
  { id: 2, label: t('quote.RealQuote.Flying'), color: 'bg-gradient-to-br from-red-500/80 from-30% to-red-500/40 to-80%' },     
  { id: 3, label: t('quote.RealQuote.HongKong'), color: 'bg-gradient-to-br from-orange-500/80 from-30% to-orange-500/40 to-80%' },  
  { id: 4, label: t('quote.RealQuote.Other'), color: 'bg-gradient-to-br from-yellow-500/80 from-30% to-yellow-500/40 to-80%' },  
  ]
)
const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!

/** 生成价格弹窗 */
function openImage(id: number){
  store.ImageDialogID = id
  store.IsImageDialog = true
}
</script>

<template>
  <!-- 实时报价单卡片 -->
  <section
    class="relative mx-auto my-4 rounded-3xl 
           bg-gradient-to-br from-white/90 to-gray-100/50 dark:from-black/90 dark:to-black/50
           shadow-md border border-white/30 backdrop-blur-xl overflow-hidden"
  >
    <div class="relative text-center py-3">
      <h2
        class="text-xl sm:text-2xl font-bold text-transparent bg-clip-text 
               bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 cursor-pointer drop-shadow-md"
      >
        ··· {{ t('quote.RealQuote.Real') }} ···
      </h2>
      <div class="mx-auto mt-2 w-24 h-[2px] bg-gradient-to-r from-transparent via-gray-300/70 to-transparent rounded-full"></div>
    </div>

    <div
      class="relative flex flex-wrap justify-evenly p-2 items-center gap-4 sm:gap-8 px-4 
             overflow-visible scroll-smooth"
    >
      <div
        v-for="item in realTime"
        :key="item.id"
        @click="openImage(item.id)"
        class="group cursor-pointer select-none flex flex-col items-center shrink-0 
               w-[calc(25%-1rem)] sm:w-[calc(25%-2rem)]
               transition-all duration-300 ease-out"
      >
        <div
          class="relative aspect-square w-full flex items-center justify-center rounded-full 
                 bg-gradient-to-br shadow-md
                 transition-all duration-300 ease-out group-hover:scale-[1.08] 
                 group-hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)]"
          :class="[
            `bg-gradient-to-tr ${item.color}`,
            `animate-bounce custom-delay-${item.id}`
          ]"
        >
          <div class="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 blur-sm transition-all duration-300"></div>
          <div class="relative z-10 font-bold text-white text-md sm:text-sm drop-shadow-sm">
            {{ item.id == 4 ? '三星' : 'iPhone' }}
          </div>
        </div>
      
        <div
          class="mt-2 sm:mt-3 text-gray-800 dark:text-white font-medium text-xs sm:text-sm 
                 group-hover:text-sky-600 transition-colors duration-300 text-center"
        >
          {{ item.label }}
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
@keyframes bounceCustom {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.animate-bounce {
  animation: bounceCustom 1s infinite;
}

.custom-delay-1 { animation-delay: 0s; }
.custom-delay-2 { animation-delay: 0.3s; }
.custom-delay-3 { animation-delay: 0.6s; }
.custom-delay-4 { animation-delay: 0.9s; }
.custom-delay-5 { animation-delay: 1.2s; }
</style>

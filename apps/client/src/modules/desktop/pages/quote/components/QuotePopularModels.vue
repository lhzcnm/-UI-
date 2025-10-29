<script setup lang="ts">
import { QUOTE_STORE, type quoteType } from '../utils/store'
import { HotModel } from '../api/quote'

const store = inject<quoteType>(QUOTE_STORE)!
const bool = ref(false)
const { t } = useI18n()

async function GetHotModel(type: string) {
  try {
    const res = await HotModel(type)
    store.hotModel = res
    store.IsPopularModels = true
    console.log(res);
    
  } catch (error) {
    console.error('获取热门机型失败：', error)
  }
}

</script>

<template>
  
  <section class="relative px-2 mx-auto my-4 w-full rounded-3xl bg-gradient-to-br from-white/90 to-gray-100/60 dark:from-black/90 dark:to-black/50 shadow-md border border-white/40 backdrop-blur-md overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-tr from-sky-100/40 via-purple-100/30 to-pink-100/30 blur-3xl opacity-50"></div>
  
    <div class="relative text-center py-4">
      <h2 class="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-sm">
        ··· {{ t('quote.PersonalizedQuotation.Popular') }} ···
      </h2>
      <div class="mx-auto mt-2 w-24 h-[2px] bg-gradient-to-r from-transparent via-gray-300/70 to-transparent rounded-full"></div>
    </div>
  
    <div
      class="relative overflow-x-auto scroll-smooth pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div class="grid grid-rows-2 auto-cols-[10rem] gap-2 grid-flow-col">
        <div
          v-for="item in store.hotModelType.slice(0, 20)"
          :key="item.name"
          class="group relative flex flex-col items-center justify-center cursor-pointer select-none rounded-3xl
                 border border-white/60 bg-gradient-to-br from-white/60 via-gray-100/40 to-white/10
                 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]
                 hover:shadow-[0_8px_25px_-4px_rgba(0,0,0,0.15)]
                 hover:-translate-y-[4px] hover:scale-[1.03]
                 transition-all duration-500 ease-[cubic-bezier(.25,.8,.25,1)]
                 backdrop-blur-2xl overflow-hidden"
          @click="GetHotModel(item.name)"
          style="height: 6.5rem;"
        >
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
                   bg-gradient-to-br from-sky-400/30 via-purple-300/25 to-pink-300/20 blur-2xl">
          </div>
        
          <div
            class="absolute inset-0 rounded-3xl ring-1 ring-transparent
                   group-hover:ring-[3px] group-hover:ring-sky-400/50
                   transition-all duration-500 ease-out">
          </div>
        
          <div
            class="relative z-10 text-[0.95rem] sm:text-base font-semibold text-gray-700 dark:text-white tracking-wide
                   group-hover:text-sky-600 transition-colors duration-300 italic">
            {{ item.name }}
          </div>
        
          <div
            class="absolute bottom-0 left-0 right-0 h-[2px]
                   bg-gradient-to-r from-transparent via-sky-400/50 to-transparent
                   opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          </div>
        
          <div
            class="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-500 rounded-3xl">
          </div>
        </div>

      </div>
    </div>
  </section>

  <XDialog v-model="bool">
    免费次数已用完
  </XDialog>
</template>
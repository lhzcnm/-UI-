<script setup lang="ts">
import QuotePopularModelsCard from './QuotePopularModels.vue'
import { Icon } from '@iconify/vue'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const store = inject<quoteType>(QUOTE_STORE)!
const { t } = useI18n()
function isOpen() {
  store.IsCreateQuote = true
  setTimeout(()=>{
    store.IsPopularModels = false
  },200)
}


</script>

<template>
  <section class="bg-zinc-100 dark:bg-black h-screen flex flex-col">
    <div class="relative h-12 flex items-center justify-center bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100 shadow-md border-b border-gray-200">
      <Icon
        icon="charm:circle-minus"
        class="absolute right-3 size-6 text-gray-600 hover:text-sky-600 transition-colors duration-300 cursor-pointer"
        @click="store.IsPopularModels = false"
      />
      <div class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md select-none">
        {{ t('quote.PopularModel.PopularModel') }}
      </div>
    </div>

    <div class=" flex-1 space-y-2 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">
        <img class="rounded-b-2xl w-full" :src="t('quote.Image')" alt="" @click="isOpen()">
    
        <div class="p-4" @click.stop>
          <div
          class="relative rounded-2xl overflow-hidden p-4 mb-5 
                 bg-gradient-to-br from-white/70 to-gray-100/40 backdrop-blur-xl 
                 shadow-[0_6px_20px_rgba(0,0,0,0.05)] 
                 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] 
                 transition-all duration-500 ease-out border border-white/50"
        >
          <div class="absolute inset-0 bg-gradient-to-tr from-sky-100/30 via-purple-100/20 to-pink-100/20 blur-3xl opacity-50"></div>

          <div class="relative text-center mb-4">
            <div
              class="inline-block text-lg md:text-xl font-extrabold 
                     text-transparent bg-clip-text 
                     bg-gradient-to-r from-gray-800 via-gray-600 to-gray-500
                     tracking-wide drop-shadow-sm"
            >
              {{ store.hotModel[0].name }}
            </div>
            <div class="mx-auto mt-1 w-20 h-[2px] bg-gradient-to-r from-transparent via-gray-400/40 to-transparent rounded-full"></div>
          </div>
        
          <div class="relative flex text-[10px] sm:text-sm md:text-base w-full">
            <!-- 左侧标签列 -->
            <div
              class="flex flex-col justify-between text-right pr-4 font-semibold text-gray-700 w-26"
            >
              <div
                v-for="label in [`${t('quote.PopularModel.Memory')}`, `${t('quote.PopularModel.Refurbished')}`, `${t('quote.PopularModel.Premium')}`, `${t('quote.PopularModel.MinorWear')}`, `${t('quote.PopularModel.MajorWear')}`, `${t('quote.PopularModel.TestableDefect')}`]"
                :key="label"
                class="flex items-center justify-end h-8 sm:h-10 md:h-12"
              >
                {{ label }}：
              </div>
            </div>
          
            <!-- 右侧价格区域 -->
            <div class="flex-1 flex flex-col justify-between space-y-1 sm:space-y-2">
              <!-- 内存 -->
              <div
                class="grid grid-cols-5 gap-1 sm:gap-2 text-center font-semibold text-gray-900"
              >
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'size' + index"
                  class="flex items-center justify-center rounded-lg
                         bg-gradient-to-b from-gray-200/30 to-white/50 
                         border border-gray-200/40 
                         shadow-inner hover:shadow-md hover:-translate-y-0.5 
                         transition-all duration-300 h-8 sm:h-10 md:h-12"
                >
                  {{ item.big || '/' }}
                </div>
              </div>
            
              <!-- 充新 -->
              <div class="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'like' + index"
                  class="flex items-center justify-center rounded-lg
                         bg-gradient-to-br from-emerald-100/50 to-white/60
                         border border-emerald-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300 h-8 sm:h-10 md:h-12"
                >
                  {{ item.new || '/' }}
                </div>
              </div>
            
              <!-- 靓机 -->
              <div class="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'sty' + index"
                  class="flex items-center justify-center rounded-lg
                         bg-gradient-to-br from-sky-100/50 to-white/60
                         border border-sky-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300 h-8 sm:h-10 md:h-12"
                >
                  {{ item.beautifel || '/' }}
                </div>
              </div>
            
              <!-- 小花 -->
              <div class="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'scr' + index"
                  class="flex items-center justify-center rounded-lg
                         bg-gradient-to-br from-amber-100/50 to-white/60
                         border border-amber-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300 h-8 sm:h-10 md:h-12"
                >
                  {{ item.smallFlower || '/' }}
                </div>
              </div>
            
              <!-- 大花 -->
              <div class="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'part1' + index"
                  class="flex items-center justify-center rounded-lg
                         bg-gradient-to-br from-rose-100/50 to-white/60
                         border border-rose-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300 h-8 sm:h-10 md:h-12"
                >
                  {{ item.largeFlower || '/' }}
                </div>
              </div>
            
              <!-- 内爆 -->
              <div class="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'part2' + index"
                  class="flex items-center justify-center rounded-lg
                         bg-gradient-to-br from-pink-100/50 to-white/60
                         border border-pink-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300 h-8 sm:h-10 md:h-12"
                >
                  {{ item.theImplosionIsMeasurable || '/' }}
                </div>
              </div>
            </div>
          </div>


          </div>
        
          <!-- 热门型号卡片 -->
          <QuotePopularModelsCard/>
        
        
          <!-- <QuoteCustomer/> -->
      </div>
    </div>
  </section>
</template>
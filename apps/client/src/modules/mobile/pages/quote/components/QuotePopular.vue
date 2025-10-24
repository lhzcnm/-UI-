<script setup lang="ts">
import QuotePopularModelsCard from './QuotePopularModels.vue'
import QuoteCustomer from './QuoteCustomer.vue'
import { Icon } from '@iconify/vue'
import { QUOTE_STORE, type quoteType } from '../utils/store'

const store = inject<quoteType>(QUOTE_STORE)!

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
        icon="weui:back-filled"
        class="absolute left-3 size-5 text-gray-600 hover:text-sky-600 transition-colors duration-300 cursor-pointer"
        @click="store.IsPopularModels = false"
      />
      <div class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md select-none">
        热门型号
      </div>
    </div>

    <div class=" flex-1 space-y-2 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">
        <img class="rounded-b-2xl w-full" src="/SanHe/ChinaPhoto.jpg" alt="" @click="isOpen()">
    
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
        
          <div class="relative flex text-sm sm:text-base">
            <div class=" grid grid-rows-5 text-right pr-3 font-semibold space-y-2">
              <div>充新:</div>
              <div>靓机:</div>
              <div>小花:</div>
              <div>大花:</div>
              <div>原封:</div>
              <div>拆封:</div>
            </div>
          
            <div class="flex-1 space-y-2">
              <div class="grid grid-cols-5 gap-2 text-center font-semibold text-gray-900">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'size' + index"
                  class="py-1.5 rounded-lg bg-gradient-to-b from-gray-200/30 to-white/50 
                         border border-gray-200/40 
                         shadow-inner hover:shadow-md hover:-translate-y-0.5 
                         transition-all duration-300"
                >
                  {{ item.big || '/' }}
                </div>
              </div>
            
              <div class="grid grid-cols-5 gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'like' + index"
                  class="py-1.5 rounded-lg bg-gradient-to-br from-emerald-100/50 to-white/60
                         border border-emerald-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  {{ item.new || '/' }}
                </div>
              </div>
            
              <div class="grid grid-cols-5 gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'sty' + index"
                  class="py-1.5 rounded-lg bg-gradient-to-br from-sky-100/50 to-white/60
                         border border-sky-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  {{ item.beautifel || '/' }}
                </div>
              </div>
            
              <div class="grid grid-cols-5 gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'scr' + index"
                  class="py-1.5 rounded-lg bg-gradient-to-br from-amber-100/50 to-white/60
                         border border-amber-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  {{ item.smallFlower || '/' }}
                </div>
              </div>
            
              <div class="grid grid-cols-5 gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'part' + index"
                  class="py-1.5 rounded-lg bg-gradient-to-br from-rose-100/50 to-white/60
                         border border-rose-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  {{ item.largeFlower || '/' }}
                </div>
              </div>

              <div class="grid grid-cols-5 gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'part' + index"
                  class="py-1.5 rounded-lg bg-gradient-to-br from-rose-100/50 to-white/60
                         border border-rose-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  {{ item.theImplosionIsMeasurable || '/' }}
                </div>
              </div>

              <div class="grid grid-cols-5 gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'part' + index"
                  class="py-1.5 rounded-lg bg-gradient-to-br from-rose-100/50 to-white/60
                         border border-rose-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  {{ item.intact || '/' }}
                </div>
              </div>
              
              <div class="grid grid-cols-5 gap-2 text-center">
                <div
                  v-for="(item, index) in store.hotModel[0].price"
                  :key="'part' + index"
                  class="py-1.5 rounded-lg bg-gradient-to-br from-rose-100/50 to-white/60
                         border border-rose-200/40 
                         hover:scale-105 hover:shadow-md transition-all duration-300"
                >
                  {{ item.unpacking || '/' }}
                </div>
              </div>
            </div>
          </div>
          </div>
        
          <!-- 热门型号卡片 -->
          <QuotePopularModelsCard/>
        
          <!-- 专属客服 -->
          <QuoteCustomer/>
      </div>
    </div>
  </section>
</template>
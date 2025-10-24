<script setup lang="ts">
import router from '@/router'
import { Quotation } from '../api/quote'
import { QUOTE_STORE, type quoteType } from '../utils/store'
import QuotePopularModels from './QuotePopularModels.vue'
import { Icon } from '@iconify/vue'

const store = inject<quoteType>(QUOTE_STORE)!

watch(() => store.quotationImageType,async () => {
 await quoteImage()
})

//获取报价单图片的数据
async function quoteImage() {
  try {
    const res = await Quotation(store.quotationImageType)
    store.quotationImageData = res
    console.log( res );
    
  } catch (error) {
    console.error('获取报价单图片失败:', error)
  }
}

function quoteImageType(type: number) {
  store.quotationImageType = type
  store.IsImageDialog = true
  store.quoteImagePageBtnIsOpen = false
}

</script>

<template>
  <section class="flex-1 flex flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"  :class="`${!store.IsImageDialog ? 'pt-12' : 'pt-0'}`">

    <div v-if="!store.IsImageDialog" class="fixed top-0 left-0 w-full h-12 flex items-center justify-center 
            bg-gradient-to-r from-sky-100 via-purple-100 to-pink-100 
            shadow-md border-b border-gray-200 z-50">
      <Icon
        icon="weui:back-filled"
        class="absolute left-3 size-5 text-gray-600 hover:text-sky-600 transition-colors duration-300 cursor-pointer"
        @click="router.back()"
      />
      <div class="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-md select-none">
        报价单
      </div>
    </div>

    <div class="w-full p-2">
      <img class="w-full rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="" @click="store.IsCreateQuote = true">
    </div>

    <div class="px-4 pb-4">

      <!-- 实时报价单卡片 -->
      <section
        class="relative mx-auto my-4 max-w-6xl rounded-3xl 
               bg-gradient-to-br from-white/90 to-gray-100/50 dark:from-black/90 dark:to-black/50
               shadow-md border border-white/30 backdrop-blur-xl overflow-hidden"
      >

        <div class="relative text-center py-3">
          <h2
            class="text-xl sm:text-2xl font-bold text-transparent bg-clip-text 
                   bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 cursor-pointer drop-shadow-md"
          >
            ··· 实时报价单 ···
          </h2>
          <div class="mx-auto mt-2 w-24 h-[2px] bg-gradient-to-r from-transparent via-gray-300/70 to-transparent rounded-full"></div>
        
          <h3
            class="mt-3 text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
                   bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400
                   drop-shadow-md hover:drop-shadow-lg transition-all duration-300 cursor-pointer
                   select-none"
          >
            iPhone
          </h3>

        </div>
      
        <div
          class="relative flex justify-evenly p-2 items-center gap-4 sm:gap-8 px-4 pb-8 overflow-x-auto overflow-y-hidden 
                 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            v-for="item in [
              { id: 1, label: '香港拿货价', color: 'from-black to-gray-400' },
              { id: 2, label: '远望新机价', color: 'from-gray-600 to-gray-300' },
              { id: 3, label: '飞扬零售价', color: 'from-orange-500 to-yellow-200' },
            ]"
            :key="item.id"
            @click="quoteImageType(item.id)"
            class="group cursor-pointer select-none flex flex-col items-center shrink-0 w-[clamp(70px,18vw,110px)]
                   transition-all duration-300 ease-out"
          >
            <div
              class="relative aspect-square w-full flex items-center justify-center rounded-full 
                     bg-gradient-to-br shadow-[inset_0_2px_8px_rgba(255,255,255,0.5),_0_4px_20px_rgba(0,0,0,0.08)]
                     transition-all duration-300 ease-out group-hover:scale-[1.08] 
                     group-hover:shadow-[0_6px_25px_rgba(0,0,0,0.15)]"
              :class="`bg-gradient-to-tr ${item.color}`"
            >
              <div class="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 blur-sm transition-all duration-300"></div>
              <div class="relative z-10 font-bold text-white text-xs sm:text-sm drop-shadow-sm">iPhone</div>
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

      <!-- 高级功能区 -->
      <section
        class="relative px-4 sm:px-6 py-8 mx-auto my-6 max-w-6xl rounded-3xl 
               bg-gradient-to-br from-white/90 to-gray-100/50 dark:from-black/90 dark:to-black/50
               shadow-lg border border-white/30 backdrop-blur-xl overflow-hidden"
      >
        <!-- 标题 -->
        <div class="text-center mb-6">
          <h2
            class="text-xl sm:text-3xl font-bold text-transparent bg-clip-text 
                   bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 
                   drop-shadow-md tracking-wide"
          >
            ··· 高阶功能区 ···
          </h2>
          <div
            class="mx-auto mt-2 w-28 h-[2px] bg-gradient-to-r from-transparent via-gray-300/70 to-transparent rounded-full"
          ></div>
        </div>
      
        <!-- 卡片布局 -->
        <div
          class="grid grid-cols-1 sm:grid-cols-3 gap-6 px-2 sm:px-6 justify-items-center"
        >
          <!-- 搜索功能 -->
          <div
            @click="store.IsSearchQuote = true"
            class="group relative w-full sm:w-80 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/60 
                   transition-all duration-300 hover:scale-[1.03] hover:shadow-xl overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-amber-50/30 to-orange-50/20 opacity-60"></div>
            <div class="relative p-5 flex flex-col items-center text-center space-y-3">
              
              <h3
                class="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
                       bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400"
              >
                搜索功能
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                支持按内存、功能、外观等条件精准搜索，快速定位目标机型。
              </p>
            </div>
          </div>
        
          <!-- 个性化生成报价单 -->
          <div
            @click="store.IsCreateQuote = true"
            class="group relative w-full sm:w-80 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/60 
                   transition-all duration-300 hover:scale-[1.03] hover:shadow-xl overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-purple-50/30 to-sky-50/20 opacity-60"></div>
            <div class="relative p-5 flex flex-col items-center text-center space-y-3">
              
              <h3
                class="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
                       bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500"
              >
                个性化生成报价单
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                根据选择的机型与参数，一键生成专属报价单，展示更专业。
              </p>
            </div>
          </div>
        
          <!-- 专属客服 -->
          <div
            @click="store.IsCustomer = true"
            class="group relative w-full sm:w-80 bg-white/80 backdrop-blur-md  rounded-2xl shadow-md border border-gray-200/60 
                   transition-all duration-300 hover:scale-[1.03] hover:shadow-xl overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-sky-50/30 to-cyan-50/20 opacity-60"></div>
            <div class="relative p-5 flex flex-col items-center text-center space-y-3">
              
              <h3
                class="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
                       bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
              >
                专属客服
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                一对一专属客服支持，提供实时沟通与个性化服务体验。
              </p>
            </div>
          </div>
        </div>
      </section>


      <!-- 热门型号 -->
      <QuotePopularModels/>
      <!-- 专属客服
      <QuoteCustomer/> -->
    </div>
  </section>
</template>
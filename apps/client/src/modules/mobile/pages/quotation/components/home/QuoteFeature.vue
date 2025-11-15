<script setup lang="ts">
import  {type QUOTE_STORE_TYPE,QUOTE_STORE } from '../../utils/store'

const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!
const { t } = useI18n()
const bool = ref(false)

</script>

<template>
      <!-- 高级功能区 -->
  <section
    class="relative px-4 sm:px-6 py-8 mx-auto my-6 rounded-3xl 
           bg-gradient-to-br from-white/90 to-gray-100/50 dark:from-black/90 dark:to-black/50
           shadow-lg border border-white/30 backdrop-blur-xl overflow-hidden"
  >
    <!-- 标题 -->
    <div class="text-center mb-6">
      <h2
        class="text-xl sm:text-2xl font-bold text-transparent bg-clip-text 
               bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 
               drop-shadow-md tracking-wide"
      >
        ··· {{ t('quote.AdvancedFunctions.Advanced') }} ···
      </h2>
      <div
        class="mx-auto mt-2 w-28 h-[2px] bg-gradient-to-r from-transparent via-gray-300/70 to-transparent rounded-full"
      ></div>
    </div>
  
    <!-- 卡片布局 -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-6 px-2 sm:px-6 justify-items-center"
    >
      <!-- 查看详情 -->
      <div
        @click="store.pageShow = 'retail'"
        class="group relative w-full  bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/60 
               transition-all duration-300 hover:scale-[1.03] hover:shadow-xl overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-amber-50/30 to-orange-50/20 opacity-60"></div>
        <div class="relative p-5 flex flex-col items-center text-center space-y-3">
          
          <h3
            class="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
                   bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400"
          >
            {{ t('quote.AdvancedFunctions.Search') }}
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ t('quote.AdvancedFunctions.SearchContent') }}
          </p>
        </div>
      </div>

      <!-- 货币类型 -->
      <div
        @click="bool = true"
        class="group relative w-full h-40 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/60 
               transition-all duration-300 hover:scale-[1.03] hover:shadow-xl overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-amber-50/30 to-orange-50/20 opacity-60"></div>
        <div class="relative p-5 flex flex-col items-center text-center space-y-3">
          
          <h3
            class="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
                   bg-gradient-to-r from-yellow-400 via-purple-500 to-sky-400"
          >
            {{ t('quote.HkPriceTypeCard.title') }}
          </h3>
          <p class="text-md text-gray-600 leading-relaxed">
            {{ t('quote.HkPriceTypeCard.description') }}
          </p>
        </div>

        <div class="w-full h-8 flex justify-evenly fixed bottom-0 border-t dark:border-gray-400 border-dashed">
          <button
            @click="store.priceType = 3"
            :class="store.priceType == 3 ? 
            'flex-1 px-4  bg-blue-500 text-gray-200 transition-colors duration-200'
            : 'flex-1 px-4  bg-white text-gray-700 transition-colors duration-200'"
          >
            {{ t('quote.HkPriceTypeCard.currency1') }}
          </button>
          <button
            @click="store.priceType = 2"
            :class="store.priceType == 2 ? 
            'px-4 flex-1 bg-blue-500 text-gray-200 transition-colors duration-200'
            : 'px-4 flex-1 bg-white text-gray-700 transition-colors duration-200'"
          >
            {{ t('quote.HkPriceTypeCard.currency2') }}
          </button>
          <button
            @click="store.priceType = 1"
            :class="store.priceType == 1 ? 
            'px-4 flex-1 bg-blue-500 text-gray-200 transition-colors duration-200'
            : 'px-4 flex-1 bg-white text-gray-700 transition-colors duration-200'"
          >
            {{ t('quote.HkPriceTypeCard.currency3') }}
          </button>
        </div>
      </div>
    
      <!-- 个性化生成报价单 -->
      <div
        @click="store.pageShow = 'fillter'"
        class="group relative w-full  bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-200/60 
               transition-all duration-300 hover:scale-[1.03] hover:shadow-xl overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-purple-50/30 to-sky-50/20 opacity-60"></div>
        <div class="relative p-5 flex flex-col items-center text-center space-y-3">
          
          <h3
            class="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
                   bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500"
          >
            {{ t('quote.AdvancedFunctions.Personalized') }}
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ t('quote.AdvancedFunctions.PersonalizedContent') }}
          </p>
        </div>
      </div>
    
      <!-- 专属客服 -->
      <div
        @click="store.IsCustomer = true"
        class="group relative w-full  bg-white/80 backdrop-blur-md  rounded-2xl shadow-md border border-gray-200/60 
               transition-all duration-300 hover:scale-[1.03] hover:shadow-xl overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-sky-50/30 to-cyan-50/20 opacity-60"></div>
        <div class="relative p-5 flex flex-col items-center text-center space-y-3">
          
          <h3
            class="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text
                   bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
          >
            {{ t('quote.AdvancedFunctions.Customer') }}
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">
            {{ t('quote.AdvancedFunctions.CustomerContent') }}
          </p>
        </div>
      </div>
    </div>
  </section>

    
</template>
<script setup lang="ts">
import { QUOTE_STORE, type quoteType } from '../utils/store'


const store = inject<quoteType>(QUOTE_STORE)!
const { t } = useI18n()
</script>

<template>
  <section
        class="relative px-4 sm:px-6 py-8 mx-auto my-6 w-2/3 rounded-3xl 
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
            ··· {{ t('quote.AdvancedFunctions.Advanced') }} ···
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
                {{ t('quote.AdvancedFunctions.Search') }}
              </h3>
              <p class="text-sm text-gray-600 leading-relaxed">
                {{ t('quote.AdvancedFunctions.SearchContent') }}
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
            class="group relative w-full sm:w-80 bg-white/80 backdrop-blur-md  rounded-2xl shadow-md border border-gray-200/60 
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
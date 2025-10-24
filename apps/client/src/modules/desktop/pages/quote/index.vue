<script setup lang="ts">
import QuotePopularModels from './components/QuotepopularModel.vue'
import QuoteFeature from './components/QuoteFeature.vue';
import QuoteRealTime from './components/QuoteRealTime.vue';


</script>

<template>
  <section class="flex flex-col h-screen items-center bg-gradient-to-r from-sky-300/20 via-gray-50 to-sky-300/20
                  overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    
    <div class="fixed left-5 w-1/6 h-screen space-y-8 p-2 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
    </div>

    <div class="fixed right-5 w-1/6 h-screen space-y-8 p-2 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
      <img class=" rounded-2xl shadow-md" src="/SanHe/ChinaPhoto.jpg" alt="">
    </div>

    <div class="pb-4 w-3/5">
      <!-- 实时报价单 -->
      <QuoteRealTime/>

      <!-- 高级功能区 -->
      <QuoteFeature/>

      <!-- 热门型号 -->
      <QuotePopularModels/>

    </div>
  </section>
</template>
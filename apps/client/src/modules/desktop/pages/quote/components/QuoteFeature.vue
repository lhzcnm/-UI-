<script setup lang="ts">

</script>

<template>
  <section
    class="relative px-4 sm:px-6 py-8 mx-auto my-6 max-w-6xl rounded-3xl 
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
</template>
<script setup lang="ts">

</script>

<template>
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
</template>
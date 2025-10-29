<!-- 专属客服 -->
<script setup lang="ts">
import { QUOTE_STORE, type quoteType } from '../utils/store'

const store = inject<quoteType>(QUOTE_STORE)!

</script>

<template>
  <section class="relative mx-auto my-4 max-w-md rounded-3xl bg-gradient-to-br from-white/80 to-gray-100/50 shadow-md border border-white/30 backdrop-blur-xl overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-tr from-sky-100/40 via-purple-100/30 to-pink-100/30 blur-3xl opacity-60"></div>

        <div class="relative text-center py-4">
          <h2 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-purple-500 to-pink-500 drop-shadow-sm">
            ··· 一对一客服 ···
          </h2>
          <div class="mx-auto mt-2 w-24 h-[2px] bg-gradient-to-r from-transparent via-gray-300/70 to-transparent rounded-full"></div>
        </div>

        <div class="relative flex flex-col items-center justify-center pb-6">
          <div
            class="group relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-white/60 shadow-[0_4px_20px_-3px_rgba(0,0,0,0.1)]
                   hover:shadow-[0_6px_30px_-2px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out cursor-pointer"
            @click="store.IsCustomer = true"
          >
            <div class="absolute inset-0 bg-gradient-to-tr from-sky-300/20 via-purple-300/20 to-pink-300/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
        
            <img
              src="/SanHe/customer_service_qrcode.jpg"
              alt="客服二维码"
              class="relative z-10 w-full h-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        
          <div class="mt-4 text-gray-700 text-sm sm:text-base tracking-wide font-medium">
            扫码添加专属客服
          </div>
          <div class="text-gray-500 text-xs mt-1">实时为您服务 · 即时响应</div>
        </div>
      </section>
</template>
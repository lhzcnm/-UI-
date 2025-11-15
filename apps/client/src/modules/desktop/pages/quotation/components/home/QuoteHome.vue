<script setup lang="ts">
import  {type QUOTE_STORE_TYPE,QUOTE_STORE } from '../../utils/store'
import QuoteFeature from './QuoteFeature.vue'
import QuoteRealTime from './QuoteRealTime.vue'

const store = inject<QUOTE_STORE_TYPE>(QUOTE_STORE)!

const { locale } = useI18n()

const mode = import.meta.env.VITE_APP_MODE

const img = computed(() => {
  return locale.value === 'zh' ? `/${mode}/ChinaPhoto.jpg` : `/${mode}/EnglishPhoto.jpg`
})
</script>

<template>
  <section class=" h-screen mb-14 flex flex-col overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

    <img class="w-1/2 mx-auto rounded-2xl shadow-lg mt-4" :src="img" alt="" @click="store.pageShow = 'fillter'">

    <div class="px-4">

      <!-- 实时报价单卡片 -->
      <QuoteRealTime/>

      <!-- 高级功能区 -->
      <QuoteFeature/>
    </div>
  </section>
</template>
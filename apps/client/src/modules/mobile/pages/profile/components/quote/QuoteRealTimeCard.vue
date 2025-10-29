<script setup lang="ts">
import router from '@/router'
import { Icon } from '@iconify/vue'
import { PriceRefresh } from '../../../quote/api/quote'

const { t } = useI18n()
const isRefreshing = ref(false)

async function refreshPrice() {
  if (isRefreshing.value) return // 防止重复触发
  isRefreshing.value = true

  try {
    await PriceRefresh()
    router.push('quote')
    console.log(1);
    
  } catch (error) {
    console.error('价格刷新失败:', error)
  } finally {
    isRefreshing.value = false
  }
}

</script>

<template>
  <section class="mb-3 bg-card rounded-lg text-sm"  @click="refreshPrice()">

    <div class="flex flex-row justify-between px-4 pt-4">
      <span class="text-lg">{{ t('quote.Title')  }}</span>
      
      <div class="flex flex-rows items-center text-muted-foreground">
        {{ t('profile.mobile.text.detail') }} <Icon icon="lucide:chevron-right" class="size-4" />
      </div>
    </div>

    <div class="w-full flex flex-row justify-between p-4">
     <div class="w-full flex space-x-1">
        <div class="w-1/4 ">
          <div class="p-1 flex justify-center items-center">
            <div class="w-4/5  aspect-square rounded-full flex items-center justify-center bg-gradient-to-tr from-black to-gray-100 text-white font-bold text-md shadow-inner">
              iPhone
            </div>
          </div>
        
          <div class="text-center pb-4">
            <div class="text-gray-900">{{ t('quote.RealQuote.HongKong') }}</div>
          </div>
        
        </div>

        <div class="w-1/4 ">
          <div class="p-1 flex justify-center items-center">
            <div class="w-4/5  aspect-square rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-500 to-gray-100 text-white font-bold text-md shadow-inner">
              iPhone
            </div>
          </div>
        
          <div class="text-center pb-4">
            <div class="text-gray-900">{{ t('quote.RealQuote.FarVision') }}</div>
          </div>
        
        </div>

        <div class="w-1/4 ">
          <div class="p-1 flex justify-center items-center">
            <div class="w-4/5  aspect-square rounded-full flex items-center justify-center bg-gradient-to-tr from-orange-600 to-gray-100 text-white font-bold text-md shadow-inner">
              iPhone
            </div>
          </div>
        
          <div class="text-center pb-4">
            <div class="text-gray-900">{{ t('quote.RealQuote.Flying') }}</div>
          </div>
        
        </div>

        <div class="w-1/4 ">
          <div class="p-1 flex justify-center items-center">
            <div class="w-4/5  aspect-square rounded-full flex items-center justify-center bg-gradient-to-tr from-gray-500 to-gray-100 text-white font-bold text-md shadow-inner">
              iPhone
            </div>
          </div>
        
          <div class="text-center pb-4">
            <div class="text-gray-900">{{ t('quote.RealQuote.Other') }}</div>
          </div>
        
        </div>

        
      </div>

    </div>
  </section>
</template>
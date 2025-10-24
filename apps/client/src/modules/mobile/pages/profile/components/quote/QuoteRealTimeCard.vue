<script setup lang="ts">
import router from '@/router'
import { Icon } from '@iconify/vue'

</script>

<template>
  <section class="mb-3 bg-card rounded-lg text-sm"  @click="router.push('quote')">

    <div class="flex flex-row justify-between px-4 pt-4">
      <span class="text-lg">报价单</span>
      
      <div class="flex flex-rows items-center text-muted-foreground">
        <span>详情 </span>
        <Icon icon="akar-icons:chevron-right"></Icon>
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
            <div class="text-gray-900">香港拿货价</div>
          </div>
        
        </div>

        <div class="w-1/4 ">
          <div class="p-1 flex justify-center items-center">
            <div class="w-4/5  aspect-square rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-500 to-gray-100 text-white font-bold text-md shadow-inner">
              iPhone
            </div>
          </div>
        
          <div class="text-center pb-4">
            <div class="text-gray-900">远望新机价</div>
          </div>
        
        </div>

        <div class="w-1/4 ">
          <div class="p-1 flex justify-center items-center">
            <div class="w-4/5  aspect-square rounded-full flex items-center justify-center bg-gradient-to-tr from-orange-600 to-gray-100 text-white font-bold text-md shadow-inner">
              iPhone
            </div>
          </div>
        
          <div class="text-center pb-4">
            <div class="text-gray-900">飞扬零售价</div>
          </div>
        
        </div>

        <div class="w-1/4 ">
          <div class="p-1 flex justify-center items-center">
            <div class="w-4/5  aspect-square rounded-full flex items-center justify-center bg-gradient-to-tr from-gray-500 to-gray-100 text-white font-bold text-md shadow-inner">
              iPhone
            </div>
          </div>
        
          <div class="text-center pb-4">
            <div class="text-gray-900">其他报价</div>
          </div>
        
        </div>

        
      </div>

    </div>
  </section>
</template>
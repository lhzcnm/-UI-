<script setup lang="ts">
import KeyForm from './components/KeyForm.vue'

import { twJoin } from 'tailwind-merge'

const uStore = useUserStore()

onMounted(() => {
  uStore.isAdminAuth = false
})
</script>

<template>
  <div
    :class="twJoin(
      'relative flex flex-col items-center justify-center',
      'h-screen bg-left-top bg-zinc-900 text-white',
      'bg-[url(/images/bg-dark-grain.png)]'
    )"
  >
    <div class="flex mb-8">
      <div class="flex justify-center">
        <!-- <img class="w-40" :src="`/${mode}/logo.svg`"alt=""> -->
        
        <TheLogo :show-logo="false" />
      </div>
    </div>

    <KeyForm />
  </div>
</template>

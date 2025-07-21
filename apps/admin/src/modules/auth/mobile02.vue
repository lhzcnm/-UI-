<script setup lang="ts">
import KeyForm from './components/KeyForm.vue'
import { twJoin } from 'tailwind-merge'

const mode = import.meta.env.VITE_APP_MODE
</script>

<template>
  <div
    :class="twJoin(
      'relative flex flex-col items-center justify-center',
      'h-screen bg-left-top bg-zinc-900 text-white',
      'bg-[url(/images/bg-dark-grain.png)]'
    )"
  >
    <div class="w-full px-6 -mt-12 text-center">
      <div class="flex justify-center">
        <img class="w-40" :src="`/${mode}/logo.svg`"alt="">
      </div>
      <KeyForm />
    </div>
  </div>
</template>

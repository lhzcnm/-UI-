<script setup lang="ts">
import KeyForm from './components/KeyForm.vue'
import { twJoin } from 'tailwind-merge'
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
      <TheLogo height="2rem" class="text-white" />
    </div>

    <KeyForm />
  </div>
</template>

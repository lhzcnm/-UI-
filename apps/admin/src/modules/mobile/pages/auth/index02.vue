<script setup lang="ts">
import KeyForm from '@forms/auth/KeyForm.vue'
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
    <div class="w-full px-6 -mt-12 text-center">
      <TheLogo height="1.8rem" class="text-white mb-12" />
      <KeyForm />
    </div>
  </div>
</template>

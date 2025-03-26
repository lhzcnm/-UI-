<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import { randomNumber } from '@/utils'

const key = ref('')
const loginBg = randomLoginBg()

function randomLoginBg() {
  const baseUrl = import.meta.env.BASE_URL
  const randomBg = randomNumber(1, 6)
  return `${baseUrl}images/login_bg0${randomBg}.jpg`
}

function handleLogin() {
  console.log(key.value)
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen w-full bg-cover bg-center text-white relative"
    :style="{ backgroundImage: `url(${loginBg})` }"
  >
    <div class="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
    <div class="relative z-10">
      <div class="flex flex-col items-center justify-center mb-8">
        <TheLogo height="2rem" class="text-white" />
      </div>

      <form @submit.prevent="handleLogin">
        <div 
          :class="twJoin(
            'relative flex items-center justify-center',
            'rounded-full pl-3 py-1 pr-1 transition-all',
            'bg-white/10 backdrop-blur-sm border border-white/20',
            'focus-within:ring-1 focus-within:ring-white/30 focus-within:border-white/40',
            'flow-light-input'
          )"
        >
          <input
            v-model="key"
            class="w-72 bg-transparent outline-none font-mono placeholder:text-white/60"
            autofocus placeholder="Login Key"
          />
          <button type="submit" class="relative z-10 rounded-full bg-primary p-2">
            <Icon icon="lucide:arrow-right" class="size-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'

const key = ref('')

function handleLogin() {
  if (!key.value) {
    toast.warning('请输入登录密钥')
    return
  }

  // TODO: login logic
}
</script>

<template>
  <form @submit.prevent="handleLogin">
    <div 
      :class="twJoin(
        'flex items-center justify-center',
        'rounded-full pl-3 sm:pl-5 py-1 pr-1 transition-all',
        'bg-white/10 backdrop-blur-sm border border-white/20',
        'focus-within:ring-1 focus-within:ring-white/30 focus-within:border-white/40',
      )"
    >
      <input
        v-model="key"
        class="w-full sm:w-72 bg-transparent outline-none font-mono placeholder:text-white/60"
        autofocus placeholder="Login Key"
      />
      <button type="submit" class="relative z-10 rounded-full bg-primary p-2">
        <Icon icon="lucide:arrow-right" class="size-5 text-white" />
      </button>
    </div>
  </form>
</template>

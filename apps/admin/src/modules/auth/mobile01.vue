<script setup lang="ts">
import AccountForm from './components/AccountForm.vue'
import QrcodeForm from './components/QrcodeForm.vue'
import { Icon } from '@iconify/vue'

import { twJoin } from 'tailwind-merge'
import { randomNumber } from '@/utils'

type LoginMethodOptions = {
  password: LoginMethodOption
  wechat: LoginMethodOption
}

interface LoginMethodOption {
  name: string
  icon: string
}

type LoginMethod = keyof LoginMethodOptions
const loginMethod = ref<LoginMethod>('password')
const isAccountLogin = computed(() => loginMethod.value === 'password')

const loginBg = randomLoginBg()
const loginMethods: LoginMethodOptions = {
  password: {
    name: '密码登录',
    icon: 'lucide:qr-code',
  },
  wechat: {
    name: '微信登录',
    icon: 'lucide:keyboard',
  },
}

function randomLoginBg() {
  const baseUrl = import.meta.env.BASE_URL
  const randomBg = randomNumber(1, 6)
  return `${baseUrl}images/login_bg0${randomBg}.jpg`
}

function toggleLoginMethod() {
  const isPassword = loginMethod.value === 'password'
  loginMethod.value = isPassword ? 'wechat' : 'password'
}
</script>

<template>
  <div
    class="min-h-screen w-full bg-cover bg-center flex flex-col" 
    :style="{ backgroundImage: `url(${loginBg})` }"
  >
    <div class="pt-12 pb-8 text-center">
      <div class="mb-4 flex justify-center">
        <div class="rounded-full bg-primary p-2">
          <Icon icon="lucide:cog" class="size-8 text-white animate-spin-slow" />
        </div>
      </div>
      <TheLogo height="2rem" />
    </div>

    <div class="flex-1 flex flex-col px-4">
      <div
        :class="twJoin(
          'w-full rounded-xl',
          'p-6 bg-white/80',
          'shadow-xl shadow-primary/10 backdrop-blur-md'
        )"
      >
        <div class="flex justify-end mb-4">
          <button
            class="p-2 rounded-full"
            :title="loginMethods[loginMethod].name"
            @click="toggleLoginMethod"
          >
            <Icon
              :icon="loginMethods[loginMethod].icon" 
              class="size-5 text-primary" 
            />
          </button>
        </div>

        <Transition name="fade-in-scale" mode="out-in">
          <AccountForm v-if="isAccountLogin" />
          <QrcodeForm v-else />
        </Transition>
      </div>
    </div>
  </div>
</template>

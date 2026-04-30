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

const uStore = useUserStore()

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

onMounted(() => {
  uStore.isAdminAuth = false
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-screen w-full bg-cover bg-center" 
    :style="{ backgroundImage: `url(${loginBg})` }"
  >
    <div
      :class="twJoin(
        'relative overflow-hidden w-full max-w-md',
        'p-8 border rounded-xl bg-white/80',
        'shadow-2xl shadow-primary/20 backdrop-blur-md'
      )"
    >
      <div class="absolute right-0 top-0 z-20">
        <a
          href="javascript:void(0)"
          class="flex items-center justify-center size-10"
          :title="loginMethods[loginMethod].name"
          @click="toggleLoginMethod"
        >
          <Icon
            :icon="loginMethods[loginMethod].icon" 
            class="size-5 text-primary" 
          />
        </a>
      </div>

      <div class="mb-8 text-center">
        <div class="mb-2 flex justify-center">
          <div class="rounded-full bg-primary p-2">
            <Icon icon="lucide:cog" class="size-10 text-white animate-spin-slow" />
          </div>
        </div>
        <div class="flex justify-center">
          <TheLogo :show-logo="false" />
        </div>
      </div>

      <Transition name="fade-in-scale" mode="out-in">
        <AccountForm v-if="isAccountLogin" />
        <QrcodeForm v-else />
      </Transition>
    </div>
  </div>
</template>

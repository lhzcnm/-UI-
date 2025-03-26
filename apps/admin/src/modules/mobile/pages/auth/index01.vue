<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { randomNumber } from '@/utils'
import { twJoin } from 'tailwind-merge'

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

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

const loginBg = randomLoginBg()

const isLoading = ref(false)
async function handleLogin() {
  isLoading.value = true
  // TODO: login logic
}

function handleForgotPassword() {
  toast.info('请联系管理员!')
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
          <form
            v-if="loginMethod === 'password'"
            class="space-y-4"
            @submit.prevent="handleLogin"
          >
            <div class="space-y-2">
              <label
                for="username"
                class="block text-sm font-medium text-secondary-foreground"
              >
                用户名
              </label>
              <XInput 
                id="username"
                v-model="loginForm.username"
                placeholder="请输入用户名"
                class="bg-white/70 backdrop-blur-sm"
              />
            </div>
            
            <div class="space-y-2">
              <label
                for="password"
                class="block text-sm font-medium text-secondary-foreground"
              >
                密码
              </label>
              <XInput 
                id="password"
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                class="bg-white/70 backdrop-blur-sm"
              />
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  v-model="loginForm.remember"
                  class="size-4"
                />
                <span class="text-sm text-secondary-foreground">记住我</span>
              </label>
              <a
                href="javascript:void(0)"
                class="text-sm text-primary hover:underline"
                @click="handleForgotPassword"
              >忘记密码?</a>
            </div>

            <XButton
              type="submit"
              class="w-full h-12 text-base"
              :loading="isLoading"
            >
              登录
            </XButton>
          </form>

          <div v-else class="space-y-4 text-center mb-6">
            <div class="flex justify-center">
              <div class="size-48 rounded-md bg-white p-2 shadow-sm">
                <div class="flex size-full items-center justify-center rounded-md border-2 border-dashed border-zinc-200">
                  <Icon icon="lucide:qr-code" class="size-16 text-zinc-300" />
                </div>
              </div>
            </div>
            <p class="text-sm text-secondary-foreground">微信扫一扫登录</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

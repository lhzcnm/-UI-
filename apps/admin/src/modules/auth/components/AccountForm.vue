<script setup lang="ts">
import { encrypt } from '@3un/utils'
import { toast } from 'vue-sonner'

import { validate } from '@/utils'

import type { LoginForm } from '../api/types'
import authApi from '../api'

const remember = ref(false)
const form: LoginForm = reactive({
  username: '',
  password: '',
})

const router = useRouter()
const isLoading = ref(false)

function validateLoginForm() {
  const { username, password } = form
  const rules = [
    { rule: !!username, message: '请输入用户名' },
    { rule: !!password, message: '请输入密码' },
  ]

  return validate(rules)
}

async function handleLogin() {
  if (!validateLoginForm()) return
  
  const encrypted = encrypt(form.password)
  if (!encrypted) return

  isLoading.value = true
  const response = authApi.login({
    username: form.username,
    password: encrypted,
  })

  response.then(async ({ data }) => {
    let storage = sessionStorage
    if (remember.value) storage = localStorage

    storage.setItem(
      import.meta.env.VITE_ACCESS_TOKEN,
      data,
    )

    isLoading.value = false
    await router.push('/')
  })
}

function handleForgotPassword() {
  toast.info('请联系管理员!')
}
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="handleLogin"
  >
    <div class="space-y-2">
      <label
        for="username"
        class="block text-sm font-medium text-muted-foreground"
      >
        用户名
      </label>
      <XInput 
        id="username"
        v-model="form.username"
        placeholder="请输入用户名"
        class="bg-white/70 backdrop-blur-sm"
      />
    </div>

    <div class="space-y-2">
      <label
        for="password"
        class="block text-sm font-medium text-muted-foreground"
      >
        密码
      </label>
      <XInput 
        id="password"
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        class="bg-white/70 backdrop-blur-sm"
      />
    </div>

    <div class="flex items-center justify-between">
      <label class="flex items-center space-x-2">
        <input 
          type="checkbox" 
          v-model="remember"
          class="size-4"
        />
        <span class="text-sm text-muted-foreground">记住我</span>
      </label>
      <a
        href="javascript:void(0)"
        class="text-sm text-primary hover:underline"
        @click="handleForgotPassword"
      >忘记密码?</a>
    </div>

    <XButton
      class="w-full"
      :loading="isLoading"
      type="submit"
    >
      登录
    </XButton>
  </form>
</template>

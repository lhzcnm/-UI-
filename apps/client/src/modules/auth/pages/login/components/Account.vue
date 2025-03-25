<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

import { encrypt } from '@3un/utils'
import { validate, VERIFY_MSG } from '@/utils'

import type { LoginMode } from '../types'
import loginApi from '../api'

const mode = defineModel<LoginMode>({ required: true })
const visible = defineModel<boolean>('visible', { required: true })

const router = useRouter()

const form = reactive({
  username: '',
  password: '',
})

function rules(data: typeof form) {
  const { username, password } = data
  return [
    { rule: !!username.trim(), message: VERIFY_MSG.USERNAME },
    { rule: !!password.trim(), message: VERIFY_MSG.PASSWORD },
  ]
}

function onSubmit() {
  if (!validate(rules(form))) return
  visible.value = true
}

defineExpose({
  login(id: string) {
    const password = encrypt(form.password)
    if (!password) return

    const key = import.meta.env.VITE_ACCESS_TOKEN
    const body = { username: form.username, password, id }
    const response = loginApi.accountLogin(body)

    response.then(async ({ data }) => {
      localStorage.setItem(key, data)
      await router.push('/')
    })
  }
})

function toRegister() {
  // const flag = store.settings.enableRegister
  // if (flag) router.push('/auth/register')
  toast.info('注册功能，暂未开放')
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">账号登录</h2>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <XInput v-model="form.username" placeholder="用户名" />
      <XInput v-model="form.password" type="password" placeholder="密码 / API KEY" />
      <XButton class="w-full" label="登录" type="submit" />
    </form>
    <div class="flex items-center justify-between mt-3 text-muted-foreground text-sm">
      <span>没有账号？<a href="javascript:void(0)" class="hover:underline" @click="toRegister">立即注册</a></span>
      <RouterLink class="hover:underline" to="/auth/forgot">忘记密码?</RouterLink>
    </div>
    <div class="mt-6 text-center">
      <hr class="hr-fade-content text-muted-foreground mb-2" data-content="第三方登录方式">
      <div class="flex items-center justify-center space-x-2 select-none">
        <a href="javascript:void(0)" @click="mode = 'wechat'" class="rounded-full bg-emerald-500 p-1">
          <Icon icon="mage:we-chat" class="size-7 sm:size-6 text-white" />
        </a>
        <a href="javascript:void(0)" @click="mode = 'phone'" class="rounded-full bg-blue-500 p-1">
          <Icon icon="mage:mobile-phone" class="size-7 sm:size-6 text-white" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCountdown, phoneReg, passwordReg, encrypt, VERIFY_MSG } from '@3un/utils'

import type { RegisterForm } from '@3un/shared/auth'
import authApi from '@/api/auth'
import { SliderCaptcha } from '@3un/ui'

const router = useRouter()
const { count, isRunning, startCountdown } = useCountdown()

const visible = ref(false)
const form: RegisterForm = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  inviteCode: '',
})

async function sendCaptcha() {
  const ruleValid = [
    { rule: !!form.phone, message: VERIFY_MSG.PHONE },
    { rule: phoneReg.test(form.phone), message: VERIFY_MSG.PHONE_FORMAT },
  ]

  if (!validate(ruleValid)) return
  authApi.sendSMS(form.phone)

  startCountdown()
}

function rules(data: RegisterForm) {
  const { phone, code, password, confirmPassword } = data
  return [
    { rule: !!phone, message: VERIFY_MSG.PHONE },
    { rule: phoneReg.test(phone), message: VERIFY_MSG.PHONE_FORMAT },

    { rule: !!code, message: VERIFY_MSG.CODE },

    { rule: !!password, message: VERIFY_MSG.PASSWORD },
    { rule: passwordReg.test(password), message: VERIFY_MSG.PASSWORD_FORMAT },

    { rule: password === confirmPassword, message: VERIFY_MSG.PASSWORD_CONFIRM },
  ]
}

function onSubmit() {
  if (!validate(rules(form))) return
  visible.value = true
}

function handleSubmit(id: string) {
  const password = encrypt(form.password)
  if (!password) return

  const key = import.meta.env.VITE_ACCESS_TOKEN
  const response = authApi.register({ ...form, id })

  response.then(async ({ data }) => {
    localStorage.setItem(key, data)
    await router.push('/auth')
  })
}
</script>

<template>
  <div class="flex-1 py-4 sm:py-0">
    <h2 class="text-2xl font-bold mb-4">注册</h2>
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <XInput v-model="form.phone" placeholder="手机号" />
      <div class="flex items-center gap-2">
        <XInput v-model="form.code" placeholder="验证码" />
        <XButton @click.prevent="sendCaptcha" :disabled="isRunning">
          {{ isRunning ? `${count} 秒后重发` : '发送验证码' }}
        </XButton>
      </div>
      <XInput v-model="form.password" type="password" placeholder="密码" />
      <XInput v-model="form.confirmPassword" type="password" placeholder="确认密码" />
      <XInput v-model="form.inviteCode" placeholder="邀请码(可选)" />

      <div class="flex items-center gap-2">
        <XButton label="账号登录" variant="secondary" type="button" @click="router.push('/auth')" />
        <XButton class="w-full" label="注册" type="submit" />
      </div>
    </form>

    <SliderCaptcha
      v-model="visible"
      :refresh="authApi.getCaptcha"
      :verify="authApi.checkCaptcha"
      @verified="handleSubmit"
    />
  </div>
</template>

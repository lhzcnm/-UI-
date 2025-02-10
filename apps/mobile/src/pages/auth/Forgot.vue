<script setup lang="ts">
import { useCountdown, passwordReg, emailReg, phoneReg, captchaReg, encrypt, VERIFY_MSG } from '@3un/utils'
import { toast } from 'vue-sonner'

import userApi from '@/api/users'
import authApi from '@/api/auth'

const router = useRouter()
const { count, isRunning, startCountdown } = useCountdown()

const form = reactive({
  target: '',
  code: '',
  password: '',
  confirmPassword: '',
})

async function sendCaptcha() {
  const isPhone = /^1[3-9]\d{9}$/.test(form.target)
  const targetReg = isPhone ? phoneReg : emailReg
  const ruleValid = [
    { rule: !!form.target, message: VERIFY_MSG.TARGET },
    { rule: targetReg.test(form.target), message: VERIFY_MSG.TARGET_FORMAT },
  ]

  if (!validate(ruleValid)) return
  if (isPhone) authApi.sendSMS(form.target)
  else authApi.sendEmail(form.target)
  startCountdown()
}

function rules(data: typeof form) {
  const { target, code, password, confirmPassword } = data
  const isPhone = /^1[3-9]\d{9}$/.test(target)
  const targetReg = isPhone ? phoneReg : emailReg

  return [
    { rule: !!target, message: VERIFY_MSG.TARGET },
    { rule: targetReg.test(target), message: VERIFY_MSG.TARGET_FORMAT },

    { rule: captchaReg.test(code), message: VERIFY_MSG.CODE },

    { rule: !!password, message: VERIFY_MSG.PASSWORD },
    { rule: passwordReg.test(password), message: VERIFY_MSG.PASSWORD_FORMAT },

    { rule: password === confirmPassword, message: VERIFY_MSG.PASSWORD_CONFIRM },
  ]
}

function onSubmit() {
  if (!validate(rules(form))) return
  resetPassword()
}

async function resetPassword() {
  const password = encrypt(form.password)
  if (!password) return

  try {
    await userApi.updatePassword({
      target: form.target,
      code: form.code,
      password,
    })

    toast.success('密码重置成功')
    router.push('/auth')
  }
  catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="flex-1 py-4">
    <div>
      <h2 class="text-2xl font-bold mb-4">重置密码</h2>
      <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <XInput v-model="form.target" placeholder="邮箱、手机号" />
        <div class="flex items-center gap-2">
          <XInput v-model="form.code" placeholder="验证码" />
          <XButton @click.prevent="sendCaptcha" :disabled="isRunning">
            {{ isRunning ? `${count} 秒后重发` : '发送验证码' }}
          </XButton>
        </div>
        <XInput v-model="form.password" type="password" placeholder="密码" />
        <XInput v-model="form.confirmPassword" type="password" placeholder="确认密码" />

        <div class="flex items-center gap-2">
          <XButton label="账号登录" variant="secondary" type="button" @click="router.push('/auth')"></XButton>
          <XButton class="w-full" type="submit">重置</XButton>
        </div>
      </form>
    </div>
  </div>
</template>

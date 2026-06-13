<script setup lang="ts">
import { toast } from 'vue-sonner'

import { PASSWORD_REG, EMAIL_REG, PHONE_REG, CAPTCHA_REG, encrypt, useCountdown } from '@3un/utils'

import type { ForgotPswForm } from '@auth/types'
import { VERIFY_MSG, validate } from '@/utils'
import authApi from '@auth/api'

const router = useRouter()
const { count, isRunning, startCountdown } = useCountdown()

const form: ForgotPswForm = reactive({
  target: '',
  code: '',
  password: '',
  confirmPassword: '',
})

const localStore=useLocalStore()

async function sendCaptcha() {
  const isPhone = /^1[3-9]\d{9}$/.test(form.target)
  const targetReg = isPhone ? PHONE_REG : EMAIL_REG
  const ruleValid = [
    { rule: !!form.target, message: VERIFY_MSG.TARGET },
    { rule: targetReg.test(form.target), message: VERIFY_MSG.TARGET_FORMAT },
  ]

  if (!validate(ruleValid)) return
  if (isPhone) await authApi.sms(form.target)
  else await authApi.email(form.target)
  startCountdown()
}

function rules(data: typeof form) {
  const { target, code, password, confirmPassword } = data
  const isPhone = /^1[3-9]\d{9}$/.test(target)
  const targetReg = isPhone ? PHONE_REG : EMAIL_REG

  return [
    { rule: !!target, message: VERIFY_MSG.TARGET },
    { rule: targetReg.test(target), message: VERIFY_MSG.TARGET_FORMAT },

    { rule: CAPTCHA_REG.test(code), message: VERIFY_MSG.CODE },

    { rule: !!password, message: VERIFY_MSG.PASSWORD },
    { rule: /\d|\w/.test(password), message: VERIFY_MSG.PASSWORD_LESS },
    { rule: PASSWORD_REG.test(password), message: VERIFY_MSG.PASSWORD_FORMAT },

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
    await authApi.forgotPsw({
      target: form.target,
      code: form.code,
      password,
    })

    toast.success(localStore.localData['login_PasswordReset_Toast'])
    router.push('/auth')
  }
  catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="flex-1 py-4 sm:py-0">
    <div>
      <h2 class="text-2xl font-bold mb-4">{{ localStore.localData['login_ResetPassword'] }}</h2>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <XInput v-model="form.target" :placeholder="localStore.localData['login_EmailOrPhone']" />
        <div class="flex items-center space-x-2">
          <XInput v-model="form.code" :placeholder="localStore.localData['login_VerificationCode']" />
          <XButton type="button" @click.prevent="sendCaptcha" :disabled="isRunning">
            {{ isRunning ? localStore.localData['login_Resend'].replace('@',count) : localStore.localData['login_SendCode'] }}
          </XButton>
        </div>
        <XInput v-model="form.password" type="password" :placeholder="localStore.localData['login_Password']" />
        <XInput v-model="form.confirmPassword" type="password" :placeholder="localStore.localData['login_ConfirmPassword']" />

        <div class="flex items-center space-x-2">
          <XButton :label="localStore.localData['login_AccountLogin']" variant="soft" type="button" @click="router.push('/auth')"></XButton>
          <XButton class="w-full" type="submit" :label="localStore.localData['login_Reset']" />
        </div>
      </form>
    </div>
  </div>
</template>

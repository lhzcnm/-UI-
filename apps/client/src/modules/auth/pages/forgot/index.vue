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

const { t } = useI18n()

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

    toast.success(t('submit.success', { action: `${t('auth.placeholder.pwd')}${t('action.reset')}` }))
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
      <h2 class="text-2xl font-bold mb-4">{{ t('auth.forget.title') }}</h2>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <XInput v-model="form.target" :placeholder="t('auth.forget.auth')" />
        <div class="flex items-center space-x-2">
          <XInput v-model="form.code" :placeholder="t('auth.placeholder.vertify')" />
          <XButton type="button" @click.prevent="sendCaptcha" :disabled="isRunning">
            {{ isRunning ? t('auth.placeholder.countdown', { action: count }) : t('auth.placeholder.sendVerty') }}
          </XButton>
        </div>
        <XInput v-model="form.password" type="password" :placeholder="t('auth.forget.pwd')" />
        <XInput v-model="form.confirmPassword" type="password" :placeholder="t('auth.forget.confirmPwd')" />

        <div class="flex items-center space-x-2">
          <XButton :label="t('auth.method.account')" variant="soft" type="button" @click="router.push('/auth')"></XButton>
          <XButton class="w-full" type="submit" :label="t('auth.forget.button')" />
        </div>
      </form>
    </div>
  </div>
</template>

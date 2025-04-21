<script setup lang="ts">
import { toast } from 'vue-sonner'

import { useCountdown, CAPTCHA_REG, PASSWORD_REG, PHONE_REG, EMAIL_REG, encrypt } from '@3un/utils'
import { validate, VERIFY_MSG } from '@/utils'

import { noticeApi } from '@/api/notice'
import { userApi } from '@/api/user'

const props = defineProps<{ onClose: () => void }>()

const store = useUserStore()
const { count, isRunning, startCountdown } = useCountdown({
  storageKey: 'password_countdown'
})

const form = reactive({
  target: store.info.phone || store.info.email || '',
  code: '',
  password: '',
  confirmPassword: ''
})

async function sendCaptcha() {
  const isPhone = /^1[3-9]\d{9}$/.test(form.target)
  const targetReg = isPhone ? PHONE_REG : EMAIL_REG
  const ruleValid = [
    { rule: !!form.target, message: VERIFY_MSG.TARGET },
    { rule: targetReg.test(form.target), message: VERIFY_MSG.TARGET_FORMAT },
  ]

  if (!validate(ruleValid)) return
  if (isPhone) await noticeApi.sms(form.target)
  else await noticeApi.email(form.target)
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

async function submitForm() {
  if (!validate(rules(form))) return
  const password = encrypt(form.password)
  if (!password) return

  await userApi.updatePassword({
    target: form.target,
    code: form.code,
    password: password
  })

  toast.success('密码修改成功')
  props.onClose()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm" autocomplete="off">
    <XInput v-model="form.target" name="phone" placeholder="请输入手机号或邮箱" />
    <div class="flex space-x-2">
      <XInput v-model="form.code" name="code" placeholder="请输入验证码" />
      <XButton type="button" :disabled="isRunning" @click.prevent="sendCaptcha">
        {{ isRunning ? `${count} 秒后重发` : '获取验证码' }}
      </XButton>
    </div>
    <XInput v-model="form.password" name="password" type="password" placeholder="新密码" />
    <XInput v-model="form.confirmPassword" name="confirmPassword" type="password" placeholder="确认新密码" />
    <XButton type="submit" class="w-full">确认修改</XButton>
  </form>
</template>

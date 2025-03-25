<script setup lang="ts">
import { toast } from 'vue-sonner'

import { useCountdown, EMAIL_REG, CAPTCHA_REG } from '@3un/utils'
import { validate, VERIFY_MSG } from '@/utils'

import { noticeApi } from '@/api/notice'
import { userApi } from '@/api/user'

const props = defineProps<{ onClose: () => void }>()

const { count, isRunning, startCountdown } = useCountdown({
  storageKey: 'email_countdown',
})

const emailForm = reactive({
  email: '',
  code: '',
})

async function sendCode() {
  const rules = [
    { rule: !!emailForm.email, message: VERIFY_MSG.EMAIL },
    { rule: EMAIL_REG.test(emailForm.email), message: VERIFY_MSG.EMAIL_FORMAT },
  ]

  if (!validate(rules)) return

  await noticeApi.email(emailForm.email)
  startCountdown()
}

async function submitForm() {
  const rules = [
    { rule: !!emailForm.email, message: VERIFY_MSG.EMAIL },
    { rule: EMAIL_REG.test(emailForm.email), message: VERIFY_MSG.EMAIL_FORMAT },

    { rule: !!emailForm.code, message: VERIFY_MSG.CODE },
    { rule: CAPTCHA_REG.test(emailForm.code), message: VERIFY_MSG.CODE_FORMAT },
  ]

  if (!validate(rules)) return

  await userApi.updateEmail({
    email: emailForm.email,
    code: emailForm.code,
  })

  toast.success('邮箱绑定成功')
  props.onClose()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <XInput v-model="emailForm.email" type="email" placeholder="请输入邮箱" />
    <div class="flex space-x-2">
      <XInput v-model="emailForm.code" placeholder="请输入验证码" />
      <XButton type="button" :disabled="isRunning" @click="sendCode">
        {{ isRunning ? `${count} 秒后重发` : '获取验证码' }}
      </XButton>
    </div>
    <XButton type="submit" class="w-full">确认绑定</XButton>
  </form>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'

import { useCountdown, PHONE_REG, CAPTCHA_REG } from '@3un/utils'
import { validate, VERIFY_MSG } from '@/utils'

import { noticeApi } from '@/api/notice'
import { userApi } from '@/api/user'

const props = defineProps<{ onClose(): void }>()

const { count, isRunning, startCountdown } = useCountdown({
  storageKey: 'phone_countdown'
})

const phoneForm = reactive({
  phone: '',
  code: ''
})

async function sendCode() {
  const rules = [
    { rule: !!phoneForm.phone, message: VERIFY_MSG.PHONE },
    { rule: PHONE_REG.test(phoneForm.phone), message: VERIFY_MSG.PHONE_FORMAT },
  ]

  if (!validate(rules)) return

  await noticeApi.sms(phoneForm.phone)
  startCountdown()
}

async function submitForm() {
  const rules = [
    { rule: !!phoneForm.phone, message: VERIFY_MSG.PHONE },
    { rule: PHONE_REG.test(phoneForm.phone), message: VERIFY_MSG.PHONE_FORMAT },
    { rule: !!phoneForm.code, message: VERIFY_MSG.CODE },
    { rule: CAPTCHA_REG.test(phoneForm.code), message: VERIFY_MSG.CODE_FORMAT },
  ]

  if (!validate(rules)) return

  await userApi.updatePhone({
    phone: phoneForm.phone,
    code: phoneForm.code
  })

  toast.success('手机号绑定成功')
  props.onClose()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <XInput v-model="phoneForm.phone" type="tel" placeholder="请输入手机号" />
    <div class="flex space-x-2">
      <XInput v-model="phoneForm.code" placeholder="请输入验证码" />
      <XButton type="button" :disabled="isRunning" @click.prevent="sendCode">
        {{ isRunning ? `${count} 秒后重发` : '获取验证码' }}
      </XButton>
    </div>
    <XButton type="submit" class="w-full">确认绑定</XButton>
  </form>
</template>

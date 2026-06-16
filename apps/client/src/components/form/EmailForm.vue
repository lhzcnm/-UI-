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

const localStore = useLocalStore()
const uStore = useUserStore()

async function sendCode() {
  const rules = [
    { rule: !!emailForm.email, message: localStore.localData[VERIFY_MSG.EMAIL]},
    { rule: EMAIL_REG.test(emailForm.email), message: localStore.localData[VERIFY_MSG.EMAIL_FORMAT] },
  ]

  if (!validate(rules)) return

  await noticeApi.email(emailForm.email)
  startCountdown()
}

async function submitForm() {
  const rules = [
    { rule: !!emailForm.email, message: localStore.localData[VERIFY_MSG.EMAIL] },
    { rule: EMAIL_REG.test(emailForm.email), message: localStore.localData[VERIFY_MSG.EMAIL_FORMAT] },

    { rule: !!emailForm.code, message: localStore.localData[VERIFY_MSG.CODE] },
    { rule: CAPTCHA_REG.test(emailForm.code), message: localStore.localData[VERIFY_MSG.CODE_FORMAT] },
  ]

  if (!validate(rules)) return

  try {
    await userApi.updateEmail({
      email: emailForm.email,
      code: emailForm.code,
    })
  
    toast.success(localStore.localData['profile_SuccessBind'])
    setTimeout(() => {
      uStore.logout()
    }, 1500)
  } catch {}

  props.onClose()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <XInput v-model="emailForm.email" type="email" :placeholder="localStore.localData['profile_ImportEmail']" />
    <div class="flex space-x-2">
      <XInput v-model="emailForm.code" :placeholder="localStore.localData['profile_PromptCodeError']" />
      <XButton type="button" :disabled="isRunning" @click.prevent="sendCode">
        {{ isRunning ? localStore.localeSlotVal('login_Resend',{'count':count}) : localStore.localData['login_SendCode'] }}
      </XButton>
    </div>
    <XButton type="submit" class="w-full">{{ localStore.localData['profile_Confirm'] }}</XButton>
  </form>
</template>

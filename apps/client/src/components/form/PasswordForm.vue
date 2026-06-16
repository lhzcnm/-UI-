<script setup lang="ts">
import { toast } from 'vue-sonner'

import { useCountdown, CAPTCHA_REG, PASSWORD_REG, PHONE_REG, EMAIL_REG, encrypt } from '@3un/utils'
import { validate, VERIFY_MSG } from '@/utils'

import { noticeApi } from '@/api/notice'
import { userApi } from '@/api/user'

const props = defineProps<{ onClose: () => void }>()

const { count, isRunning, startCountdown } = useCountdown({
  storageKey: 'password_countdown'
})
const localStore = useLocalStore()
const uStore = useUserStore()

const form = reactive({
  target         : '',
  code           : '',
  password       : '',
  confirmPassword: '',
})

async function sendCaptcha() {
  const isPhone = /^1[3-9]\d{9}$/.test(form.target)
  const targetReg = isPhone ? PHONE_REG : EMAIL_REG
  const ruleValid = [
    { rule: !!form.target, message: localStore.localData[VERIFY_MSG.TARGET] },
    { rule: targetReg.test(form.target), message: localStore.localData[VERIFY_MSG.TARGET_FORMAT] },
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
    { rule: !!target, message: localStore.localData[VERIFY_MSG.TARGET] },
    { rule: targetReg.test(target), message: localStore.localData[VERIFY_MSG.TARGET_FORMAT] },
    { rule: CAPTCHA_REG.test(code), message: localStore.localData[VERIFY_MSG.CODE] },

    { rule: !!password, message: localStore.localData[VERIFY_MSG.PASSWORD] },
    { rule: /\d|\w/.test(password), message: localStore.localData[VERIFY_MSG.PASSWORD_LESS] },
    { rule: PASSWORD_REG.test(password), message: localStore.localData[VERIFY_MSG.PASSWORD_FORMAT] },
    { rule: password === confirmPassword, message: localStore.localData[VERIFY_MSG.PASSWORD_CONFIRM] },
  ]
}

async function submitForm() {
  if (!validate(rules(form))) return
  const password = encrypt(form.password)
  if (!password) return

  try {
    await userApi.updatePassword({
      target: form.target,
      code: form.code,
      password: password
    })
  
    toast.success(localStore.localData['top_Modify'])
    setTimeout(() => {
      uStore.logout()
    }, 1500)
  } catch {}
  props.onClose()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm" autocomplete="off">
    <XInput v-model="form.target" name="phone" :placeholder="localStore.localData['profile_PhoneEmail']" />
    <div class="flex space-x-2">
      <XInput v-model="form.code" name="code" :placeholder="localStore.localData['profile_PromptNeedCode']" />
      <XButton type="button" :disabled="isRunning" @click.prevent="sendCaptcha">
        {{ isRunning ? localStore.localeSlotVal('profile_PlaceholderCountdown',{'{count}':count}) : localStore.localData['profile_PlaceholderSendVerty'] }}
      </XButton>
    </div>
    <XInput v-model="form.password" name="password" type="password" :placeholder="localStore.localData['profile_NewPassword']" />
    <XInput v-model="form.confirmPassword" name="confirmPassword" type="password" :placeholder="localStore.localData['profile_ConfirmPassword']" />
    <XButton type="submit" class="w-full">{{ localStore.localData['submit_FieldsDialogConfirm'] }}</XButton>
  </form>
</template>

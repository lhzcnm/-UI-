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
const { t } = useI18n()
const localStore = useLocalStore()
const uStore = useUserStore()

const phoneForm = reactive({
  phone: '',
  code: ''
})

async function sendCode() {
  const rules = [
    { rule: !!phoneForm.phone, message: localStore.localData[VERIFY_MSG.PHONE] },
    { rule: PHONE_REG.test(phoneForm.phone), message: localStore.localData[VERIFY_MSG.PHONE_FORMAT] },
  ]

  if (!validate(rules)) return

  await noticeApi.sms(phoneForm.phone)
  startCountdown()
}

async function submitForm() {
  const rules = [
    { rule: !!phoneForm.phone, message: localStore.localData[VERIFY_MSG.PHONE] },
    { rule: PHONE_REG.test(phoneForm.phone), message: localStore.localData[VERIFY_MSG.PHONE_FORMAT] },
    { rule: !!phoneForm.code, message: localStore.localData[VERIFY_MSG.CODE] },
    { rule: CAPTCHA_REG.test(phoneForm.code), message: localStore.localData[VERIFY_MSG.CODE_FORMAT] },
  ]

  if (!validate(rules)) return

  try {
    await userApi.updatePhone({
      phone: phoneForm.phone,
      code: phoneForm.code
    })
  
    toast.success(t('submit.success', { action: t("action.bind") }))
    setTimeout(() => {
      uStore.logout()
    }, 1500)
  } catch {}
  props.onClose()
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <XInput v-model="phoneForm.phone" type="tel" :placeholder="t('profile.placeholder.phone')" />
    <div class="flex space-x-2">
      <XInput v-model="phoneForm.code" :placeholder="t('profile.placeholder.vertify')" />
      <XButton type="button" :disabled="isRunning" @click.prevent="sendCode">
        {{ isRunning ? t('profile.placeholder.countdown', { action: count }) : t('profile.button.sendVerty') }}
      </XButton>
    </div>
    <XButton type="submit" class="w-full">{{ t('button.confirm') }}</XButton>
  </form>
</template>

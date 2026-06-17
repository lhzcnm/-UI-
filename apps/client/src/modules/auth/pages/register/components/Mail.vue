<script setup lang="ts">
import { type RegisterForm } from '@/modules/auth/types'

interface PhoneProps {
  isRunning: boolean,
  count: number,
  sendCaptcha: () => void,
}

defineProps<PhoneProps>()

const form = defineModel<RegisterForm>({ required: true })

const localStore = useLocalStore()
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <XInput v-model="form.email" :placeholder="localStore.localData['login_Email']" />
    <div class="flex items-center space-x-2">
      <XInput v-model="form.code" :placeholder="localStore.localData['login_VerificationCode']" />
      <XButton type="button" @click="sendCaptcha" :disabled="isRunning">
        {{ isRunning ? localStore.localeSlotVal('login_Resend', {'{count}': count}) : localStore.localData['login_SendCode'] }}
      </XButton>
    </div>
  </form>
</template>

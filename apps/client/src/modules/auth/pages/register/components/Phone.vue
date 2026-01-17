<script setup lang="ts">
import { type RegisterForm } from '@/modules/auth/types'

interface PhoneProps {
  isRunning: boolean,
  count: number,
  sendCaptcha: () => void,
}

defineProps<PhoneProps>()

const form = defineModel<RegisterForm>({ required: true })

const { t } = useI18n()
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <XInput v-model="form.phone" :placeholder="t('auth.placeholder.phone')" />
    <div class="flex items-center space-x-2">
      <XInput v-model="form.code" :placeholder="t('auth.placeholder.vertify')" />
      <XButton type="button" @click="sendCaptcha" :disabled="isRunning">
        {{ isRunning ? t('auth.placeholder.countdown', { action: count }) : t('auth.placeholder.sendVerty') }}
      </XButton>
    </div>
  </form>
</template>

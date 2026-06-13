<script setup lang="ts">
import type { LoginMode } from '@auth/types'
import { validate, VERIFY_MSG } from '@/utils'

import authApi from '@auth/api'
import { useCountdown, CAPTCHA_REG } from '@3un/utils'
import { AUTH_STORE } from '@/modules/auth/utils'

const store = inject(AUTH_STORE)!

const mode = defineModel<LoginMode>({ required: true })
const visible = defineModel<boolean>('visible', { required: true })

const router = useRouter()

const form = reactive({ phone: store.data, code: '' })
const { count, isRunning, startCountdown } = useCountdown()
const localStore = useLocalStore()

async function sendCaptcha() {
  const validRule = [{ rule: !!form.phone, message: localStore.localData[VERIFY_MSG.PHONE] }]
  if (!validate(validRule) || isRunning.value) return

  await authApi.sms(form.phone)
  startCountdown()
}

function rules(data: typeof form) {
  const { phone, code } = data
  return [
    { rule: !!phone.trim(), message: localStore.localData[VERIFY_MSG.PHONE] },
    { rule: CAPTCHA_REG.test(code.trim()), message: localStore.localData[VERIFY_MSG.CODE] },
  ]
}

function onSubmit() {
  if (!validate(rules(form))) return
  visible.value = true
}

function naviBack() {
  store.data = ''
  mode.value = 'account'
}

defineExpose({
  login(id: string) {
    const body = { phone: form.phone, code: form.code, id }
    const key = import.meta.env.VITE_ACCESS_TOKEN
    const response = authApi.phoneLogin(body)

    response.then(async ({ data }) => {
      localStorage.setItem(key, data)
      await router.push('/')
    })

    response.catch(() => visible.value = false)
  },
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">{{ localStore.localData['login_PhoneLogin'] }}</h2>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <XInput v-model="form.phone" :placeholder="localStore.localData['login_Phone']" />
      <div class="flex items-center space-x-2">
        <XInput v-model="form.code" :placeholder="localStore.localData['login_VerificationCode']" />
        <XButton type="button" @click.prevent="sendCaptcha" :disabled="isRunning">
          {{ isRunning ? localStore.localData['login_Resend'].replace('@',count) : localStore.localData['login_SendCode'] }}
        </XButton>
      </div>

      <div class="flex items-center space-x-2">
        <XButton :label="localStore.localData['login_AccountLogin']" variant="soft" type="button" @click="naviBack"></XButton>
        <XButton class="w-full" :label="localStore.localData['login_PLogin']" type="submit" />
      </div>
    </form>
  </div>
</template>

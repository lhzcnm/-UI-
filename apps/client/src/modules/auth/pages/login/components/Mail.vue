<script setup lang="ts">
import authApi from '@/modules/auth/api'
import type { LoginMode, MailLoginForm } from '@/modules/auth/types'
import { AUTH_STORE } from '@/modules/auth/utils'
import { validate, VERIFY_MSG, type ValidRule } from '@/utils'
import { CAPTCHA_REG, EMAIL_REG, useCountdown } from '@3un/utils'

const router = useRouter()
const localStore = useLocalStore()
const store = inject(AUTH_STORE)!

const mode = defineModel<LoginMode>({ required: true })
const visible = defineModel<boolean>('visible', { required: true })

const { count, isRunning, startCountdown } = useCountdown()

const form = reactive<MailLoginForm>({
  email: store.data,
  code: "",
})

function rules(data: typeof form): ValidRule[] {
  const { email, code } = data
  return [
    { rule: !!email.trim(), message: localStore.localData[VERIFY_MSG.EMAIL] },
    { rule: EMAIL_REG.test(email), message: localStore.localData[VERIFY_MSG.EMAIL_FORMAT] },
    
    { rule: !!code.trim(), message: localStore.localData[VERIFY_MSG.CODE] },
    { rule: CAPTCHA_REG.test(code.trim()), message: localStore.localData[VERIFY_MSG.CODE_FORMAT]}
  ]
}

function onSubmit() {
  if (!validate(rules(form))) return
  visible.value = true
}

async function sendCaptcha() {
  const validRule = [{ rule: !!form.email, message: localStore.localData[VERIFY_MSG.EMAIL] }]
  if (!validate(validRule) || isRunning.value) return

  await authApi.email(form.email)
  startCountdown()
}

function naviBack() {
  store.data = ''
  mode.value = 'account'
}

defineExpose({
  async login(id: string) {
    const key = import.meta.env.VITE_ACCESS_TOKEN
    
    try {
      const { data } = await authApi.mailLogin({...form, id: id })
      localStorage.setItem(key, data)
      await router.push("/")
    } catch {
      visible.value = false
    }
  },
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">{{ localStore.localData['login_EmailLogin'] }}</h2>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <XInput v-model="form.email" :placeholder="localStore.localData['login_Email']" />
      <div class="flex items-center space-x-2">
        <XInput v-model="form.code" :placeholder="localStore.localData['login_VerificationCode']" />
        <XButton type="button" @click.prevent="sendCaptcha" :disabled="isRunning">
          {{ isRunning ? localStore.localData['login_Resend'].replace('@',count) : localStore.localData['login_SendCode'] }}
        </XButton>
      </div>

      <div class="flex items-center space-x-2">
        <XButton :label="localStore.localData['login_AccountLogin']" variant="soft" type="button" @click="naviBack"></XButton>
        <XButton class="w-full" :label="localStore.localData['login_ELogin']" type="submit" />
      </div>
    </form>
  </div>
</template>

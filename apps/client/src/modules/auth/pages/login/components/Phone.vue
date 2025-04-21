<script setup lang="ts">
import type { LoginMode } from '@auth/types'
import { useCountdown, CAPTCHA_REG } from '@3un/utils'
import { validate, VERIFY_MSG } from '@/utils'

import authApi from '@auth/api'

const mode = defineModel<LoginMode>({ required: true })
const visible = defineModel<boolean>('visible', { required: true })

const router = useRouter()

const form = reactive({ phone: '', code: '' })
const { count, isRunning, startCountdown } = useCountdown()

async function sendCaptcha() {
  const validRule = [{ rule: !!form.phone, message: VERIFY_MSG.PHONE }]
  if (!validate(validRule) || isRunning.value) return

  authApi.sms(form.phone)
  startCountdown()
}

function rules(data: typeof form) {
  const { phone, code } = data
  return [
    { rule: !!phone.trim(), message: VERIFY_MSG.PHONE },
    { rule: CAPTCHA_REG.test(code.trim()), message: VERIFY_MSG.CODE },
  ]
}

function onSubmit() {
  if (!validate(rules(form))) return
  visible.value = true
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
  }
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">手机号登录</h2>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <XInput v-model="form.phone" placeholder="手机号" />
      <div class="flex items-center space-x-2">
        <XInput v-model="form.code" placeholder="验证码" />
        <XButton type="button" @click.prevent="sendCaptcha" :disabled="isRunning">
          {{ isRunning ? `${count} 秒后重发` : '发送验证码' }}
        </XButton>
      </div>

      <div class="flex items-center space-x-2">
        <XButton label="账号登录" variant="soft" type="button" @click="mode = 'account'"></XButton>
        <XButton class="w-full" label="登录" type="submit" />
      </div>
    </form>
  </div>
</template>

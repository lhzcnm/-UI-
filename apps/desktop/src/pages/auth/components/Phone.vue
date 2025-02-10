<script setup lang="ts">
import type { LoginMode } from '../types'
import { useCountdown, captchaReg } from '@3un/utils'
import authApi from '@/api/auth'

const mode = defineModel<LoginMode>({ required: true })
const visible = defineModel<boolean>('visible', { required: true })

const router = useRouter()

const form = reactive({ phone: '', code: '' })
const { count, isRunning, startCountdown } = useCountdown()

async function sendCaptcha() {
  const validRule = [{ rule: !!form.phone, message: '请输入手机号' }]
  if (!validate(validRule) || isRunning.value) return

  authApi.sendSMS(form.phone)
  startCountdown()
}

function rules(data: typeof form) {
  const { phone, code } = data
  return [
    { rule: !!phone.trim(), message: '请输入手机号' },
    { rule: !!captchaReg.test(code.trim()), message: '请输入验证码' },
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
  }
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">手机号登录</h2>
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
      <XInput v-model="form.phone" placeholder="手机号" />
      <div class="flex items-center gap-2">
        <XInput v-model="form.code" placeholder="验证码" />
        <XButton @click.prevent="sendCaptcha" :disabled="isRunning">
          {{ isRunning ? `${count} 秒后重发` : '发送验证码' }}
        </XButton>
      </div>

      <div class="flex items-center gap-2">
        <XButton label="账号登录" variant="secondary" type="button" @click="mode = 'account'"></XButton>
        <XButton class="w-full" label="登录" type="submit" />
      </div>
    </form>
  </div>
</template>

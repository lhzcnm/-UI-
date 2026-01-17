<script setup lang="ts">
import Phone from './components/Phone.vue'
import Mail from './components/Mail.vue'

import { toast } from 'vue-sonner'
import { EMAIL_REG, PHONE_REG, useCountdown } from '@3un/utils'
import { XSegmented, type XSegmentedOption } from '@3un/ui'

import { type RegisterForm } from '@auth/types'
import authApi from '@auth/api'
import { validate, VERIFY_MSG, type ValidRule } from '@/utils'
import { AUTH_STORE } from '@auth/utils'

const store = inject(AUTH_STORE)!

store.mode = 'phone'

const { t } = useI18n()
const { count, isRunning, startCountdown, stopCountdown } = useCountdown()
const router = useRouter()

const visible = ref<boolean>(false)

const form = reactive<RegisterForm>({
  code: "",
  phone: "",
  email: "",
})

const visibleMode = ref<'phone' | 'email'>('phone')

const initForm: RegisterForm = {
  code: '',
  phone: undefined,
  email: undefined,
}

let captchaId = ""

const options: XSegmentedOption[] = [
  {
    value: 'phone',
    label: t('auth.placeholder.phone'),
  },
  {
    value: 'email',
    label: t('auth.placeholder.Email'),
  },
]

function getRules(isRegister: boolean = true) {
  const { code, phone, email } = form
  
  let extraRules: ValidRule[] = []
  
  if (visibleMode.value === 'phone') {
    extraRules = [
      { rule: !!phone, message: t(VERIFY_MSG.PHONE) },
      { rule: PHONE_REG.test(phone!), message: t(VERIFY_MSG.PHONE_FORMAT) },
    ]
  } else {
    extraRules = [
      { rule: !!email, message: t(VERIFY_MSG.EMAIL) },
      { rule: (EMAIL_REG).test(email!), message: t(VERIFY_MSG.EMAIL_FORMAT) },
    ]
  }

  if (isRegister) {
    extraRules.push({
      rule: !!code, message: t(VERIFY_MSG.CODE),
    })
  }
  const rules: ValidRule[] = extraRules

  return rules
}

function vertifyCaptcha(id: string) {
  captchaId = id
  doRegister()
  visible.value = false
}

async function doRegister() {
  try {
    await authApi.register({ ...form, id: captchaId })
    toast.success(t('auth.toast.registerSuccess'))
    stopCountdown()
    store.data = store.mode === 'phone' ? form.phone! : form.email!
    router.push("/auth")
  } catch {}
}

async function sendCaptcha() {
  if (!validate(getRules(false)) || isRunning.value) return
  if (visibleMode.value === 'phone') {
    await authApi.register_sms(form.phone!)
  } else if (visibleMode.value === 'email') {
    await authApi.register_mail(form.email!)
  }

  startCountdown()
}

function naviToAccount() {
  store.mode = 'account'
  router.push("/auth")
}

function onSubmit() {
  if (!validate(getRules())) return
  visible.value = true
}

function initData(data: string | number) {
  visibleMode.value = data as 'phone' | 'email'
  Object.assign(form, initForm)
}
</script>

<template>
  <div class="flex-1 py-4 sm:py-0 space-y-2">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold mb-4">{{ t('auth.loginRegister') }}</h2>
      <XSegmented v-model="store.mode"
        :options @change="initData" size="sm" />
    </div>
    <div class="flex flex-col">
      <Mail v-show="visibleMode === 'email'"
        :is-running="isRunning"
        :count="count"
        :send-captcha="sendCaptcha"
        v-model="form" />

      <Phone v-show="visibleMode === 'phone'"
        :is-running="isRunning"
        :count="count"
        :send-captcha="sendCaptcha"
        v-model="form" />
        
      <div class="flex items-center space-x-2 mt-4">
        <XButton :label="t('auth.method.account')" variant="soft" type="button" @click="naviToAccount"></XButton>
        <XButton class="w-full" :label="t('auth.btnRegister')" @click="onSubmit" />
      </div>
    </div>

    <XCaptchaSlider
      v-model="visible"
      :refresh="authApi.getCaptcha"
      :verify="authApi.checkCaptcha"
      @verified="vertifyCaptcha"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { encrypt, USERNAME_REG, PASSWORD_REG } from '@3un/utils'
import { validate, VERIFY_MSG } from '@/utils'

import type { LoginMode } from '@auth/types'
import authApi from '@auth/api'
import { toast } from 'vue-sonner'

const mode = defineModel<LoginMode>({ required: true })
const visible = defineModel<boolean>('visible', { required: true })

const router = useRouter()
const { settings } = useSettingStore()

const form = reactive({
  username: '',
  password: '',
})

const { t } = useI18n()
const store = useSettingStore()

function rules(data: typeof form) {
  const { username, password } = data
  return [
    { rule: !!username.trim(), message: t(VERIFY_MSG.USERNAME) },
    { rule: username.length >=6 && username.length <= 16, message: t(VERIFY_MSG.USERNAME_LENGTH) },
    { rule: USERNAME_REG.test(username), message: t(VERIFY_MSG.USERNAME_FORMAT) },
    
    { rule: !!password.trim(), message: t(VERIFY_MSG.PASSWORD) },
    { rule: password.length >= 8 && password.length <= 18, message: t(VERIFY_MSG.PASSWORD_LENGTH) },
    { rule: PASSWORD_REG.test(password), message: t(VERIFY_MSG.PASSWORD_FORMAT) },
  ]
}

function onSubmit() {
  if (!validate(rules(form))) return
  visible.value = true
}

function naviToRegister() {
  if (settings.enableRegister) {
    router.push('/auth/register')
  } else {
    toast.warning(t('auth.toast.noFeature'))
  }
}

defineExpose({
  login(id: string) {
    const password = encrypt(form.password)
    if (!password) return

    const key = import.meta.env.VITE_ACCESS_TOKEN
    const body = { username: form.username, password, id }
    const response = authApi.accountLogin(body)

    response.then(async ({ data }) => {
      localStorage.setItem(key, data)
      await router.push('/')
    })

    response.catch(() => visible.value = false)
  }
})

function toRegister() {
  const flag = store.settings.enableRegister
  if (flag) router.push('/auth/register')
  else  toast.info(t('auth.prompt.register'))
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">{{ t('auth.method.account') }}</h2>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <XInput v-model="form.username" :placeholder="t('auth.placeholder.userName')" />
      <XInput v-model="form.password" type="password" :placeholder="`${t('auth.placeholder.pwd')} / API KEY`" />
      <XButton class="w-full" :label="t('auth.login')" type="submit" />
    </form>
    <div class="flex items-center justify-between mt-3 text-muted-foreground text-sm">
      <span>{{ t('auth.noAccount') }}?<a href="javascript:void(0)" class="hover:underline text-primary" @click="toRegister">{{ t('auth.register') }}</a></span>
      <button class="hover:underline" @click="naviToRegister">{{ t('auth.forget.label') }}?</button>
    </div>
    <div class="mt-6">
      <hr class="hr-fade-content text-muted-foreground mb-2" :data-content="t('auth.method.third')">
      <div class="flex items-center justify-center space-x-2 select-none">
        <a href="javascript:void(0)" @click="mode = 'wechat'" class="rounded-full bg-teal-500 p-1">
          <Icon icon="mage:we-chat" class="size-7 sm:size-6 text-white" />
        </a>
        <a href="javascript:void(0)" @click="mode = 'phone'" class="rounded-full bg-blue-500 p-1">
          <Icon icon="mage:mobile-phone" class="size-7 sm:size-6 text-white" />
        </a>
        <a href="javascript:void(0)" @click="mode = 'mail'" class="rounded-full bg-warning p-1">
          <Icon icon="lucide:mail" class="size-7 sm:size-6 text-white" />
        </a>
      </div>
    </div>
  </div>
</template>

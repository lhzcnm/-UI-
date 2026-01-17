<script setup lang="ts">
import Account from './components/Account.vue'
import Phone from './components/Phone.vue'
import WeChat from './components/WeChat.vue'
import Mail from './components/Mail.vue'

import authApi from '@auth/api'
import { AUTH_STORE } from '@auth/utils'

const store = inject(AUTH_STORE)!

const phoneRef = useTemplateRef('phoneRef')
const accountRef = useTemplateRef('accountRef')
const mailRef = useTemplateRef('mailRef')

const visible   = ref(false)
// const loginMode = ref<LoginMode>('account')

const options = {
  account: (id: string) => accountRef.value?.login(id),
  phone: (id: string) => phoneRef.value?.login(id),
  mail: (id: string) => mailRef.value?.login(id),
}

function doLogin(id: string) {
  options[store.mode as keyof typeof options](id)
}
</script>

<template>
  <div class="flex-1 py-4 sm:py-0">
    <Account
      v-if="store.mode === 'account'"
      v-model:visible="visible"
      v-model="store.mode"
      ref="accountRef"
    />
    <Phone
      v-if="store.mode === 'phone'"
      v-model:visible="visible"
      v-model="store.mode"
      ref="phoneRef"
    />
    <WeChat
      v-if="store.mode === 'wechat'"
      v-model="store.mode"
    />
    <Mail
      v-if="store.mode === 'mail'"
      v-model="store.mode"
      v-model:visible="visible"
      ref="mailRef"
    />

    <XCaptchaSlider
      v-model="visible"
      :refresh="authApi.getCaptcha"
      :verify="authApi.checkCaptcha"
      @verified="doLogin"
    />
  </div>
</template>

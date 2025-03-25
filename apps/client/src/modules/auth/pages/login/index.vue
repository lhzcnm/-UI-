<script setup lang="ts">
import Account from './components/Account.vue'
import Phone from './components/Phone.vue'
import WeChat from './components/WeChat.vue'

import type { LoginMode } from './types'
import authApi from '@auth/api'

const phoneRef = useTemplateRef('phoneRef')
const accountRef = useTemplateRef('accountRef')

const visible   = ref(false)
const loginMode = ref<LoginMode>('account')

const options = {
  account: (id: string) => accountRef.value?.login(id),
  phone: (id: string) => phoneRef.value?.login(id),
}

function doLogin(id: string) {
  options[loginMode.value as keyof typeof options](id)
}
</script>

<template>
  <div class="flex-1 py-4 sm:py-0">
    <Account
      v-if="loginMode === 'account'"
      v-model:visible="visible"
      v-model="loginMode"
      ref="accountRef"
    />
    <Phone
      v-if="loginMode === 'phone'"
      v-model:visible="visible"
      v-model="loginMode"
      ref="phoneRef"
    />
    <WeChat
      v-if="loginMode === 'wechat'"
      v-model="loginMode"
    />

    <XSliderCaptcha
      v-model="visible"
      :refresh="authApi.getCaptcha"
      :verify="authApi.checkCaptcha"
      @verified="doLogin"
    />
  </div>
</template>

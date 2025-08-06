<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ua } from '@3un/utils'

import InviteCode from './InviteCode.vue'

import type { Action } from '../types'

const visibleForm = ref(false)
const activeForm = ref<Action | null>(null)

const settingOptions = [
  {
    label: '修改手机号',
    icon: 'lucide:smartphone',
    action: 'phone',
  },
  {
    label: '修改邮箱',
    icon: 'lucide:mail',
    action: 'email',
  },
  {
    label: '修改密码',
    icon: 'lucide:key',
    action: 'password',
  },
  {
    label: '修改登录账号',
    icon: 'lucide:user',
    action: 'account',
  },
  !ua.isWechat && {
    label: '微信绑定',
    icon: 'hugeicons:wechat',
    action: 'wechat',
  },
  {
    label: '推荐码',
    icon: 'lucide:qr-code',
    action: 'qrcode',
  },
].filter(item => !!item)

const activeTitle = computed(() => {
  const options = {
    account: '修改登录账号',
    password: '修改密码',
    phone: '修改手机号',
    email: '修改邮箱',
    wechat: '微信绑定',
    qrcode: '生成推荐码',
  }

  return options[activeForm.value as Action]
})

function showForm(type: Action) {
  activeForm.value = type
  visibleForm.value = true
}

function closeForm() {
  activeForm.value = null
  visibleForm.value = false
}
</script>

<template>
  <section class="mb-4 bg-card rounded-lg divide-y">
    <button
      v-for="option in settingOptions" :key="option.action"
      class="w-full flex items-center p-4 text-muted-foreground"
      @click="showForm(option.action as Action)"
    >
      <Icon :icon="option.icon" class="size-5 mr-2" />
      <span class="flex-1 text-left">{{ option.label }}</span>
      <Icon icon="lucide:chevron-right" class="size-5" />
    </button>
  </section>

  <SlideRight
    v-model="visibleForm"
    :title="activeTitle"
    header-class="border-b"
  >
    <PhoneForm
      v-if="activeForm === 'phone'"
      :on-close="closeForm"
      class="p-3"
    />
    <EmailForm
      v-else-if="activeForm === 'email'"
      :on-close="closeForm"
      class="p-3"
    />
    <WechatForm
      v-else-if="activeForm === 'wechat' && !ua.isWechat"
      :on-close="closeForm"
      class="p-3 space-y-3"
    />
    <AccountForm
      v-else-if="activeForm === 'account'"
      :on-close="closeForm"
      class="p-3"
    />
    <PasswordForm
      v-else-if="activeForm === 'password'"
      :on-close="closeForm"
      class="p-3 space-y-3"
    />
    <InviteCode v-else-if="activeForm === 'qrcode'" />
  </SlideRight>
</template>

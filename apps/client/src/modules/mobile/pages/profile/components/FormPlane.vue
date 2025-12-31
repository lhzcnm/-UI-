<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ua } from '@3un/utils'

import InviteCode from './InviteCode.vue'

import type { Action } from '../types'

const visibleForm = ref(false)
const activeForm = ref<Action | null>(null)
const inviteCodeVisible = ref<boolean>(false)

const { t } = useI18n()

const settingOptions = [
  {
    label: t('profile.mobile.setting.phone'),
    icon: 'lucide:smartphone',
    action: 'phone',
  },
  {
    label: t('profile.mobile.setting.mail'),
    icon: 'lucide:mail',
    action: 'email',
  },
  {
    label: t('profile.mobile.setting.pwd'),
    icon: 'lucide:key',
    action: 'password',
  },
  {
    label: t('profile.mobile.setting.account'),
    icon: 'lucide:user',
    action: 'account',
  },
  !ua.isWechat && {
    label: t('profile.mobile.setting.wechat'),
    icon: 'hugeicons:wechat',
    action: 'wechat',
  },
  {
    label: t('profile.mobile.setting.invite'),
    icon: 'lucide:qr-code',
    action: 'qrcode',
  },
  // {
  //   label: t('profile.mobile.setting.shop'),
  //   icon: "lucide:building",
  //   action: "shop",
  // }
].filter(item => !!item)

watch(
  () => activeForm.value,
  (newVal) => {
    if(newVal === 'qrcode') {
      inviteCodeVisible.value = true
    }
  }
)

const activeTitle = computed(() => {
  const options = {
    account: t('profile.mobile.setting.account'),
    password: t('profile.mobile.setting.pwd'),
    phone: t('profile.mobile.setting.phone'),
    email: t('profile.mobile.setting.mail'),
    wechat: t('profile.mobile.setting.wechat'),
    qrcode: t('profile.mobile.setting.invite'),
    shop: t('profile.mobile.setting.shop'),
  }

  return options[activeForm.value as Action]
})

const visible = computed(() => {
  return activeForm.value !== 'qrcode' && activeForm.value !== 'shop'
})

function showForm(type: Action) {
  if(type === 'qrcode') {
    inviteCodeVisible.value = true
    return
  }
  if(type === 'shop') {
    location.href = "/shop/services"
  }
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
    v-if="visible"
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
  </SlideRight>
  <Transition name="slide-right">
    <InviteCode v-if="inviteCodeVisible" v-model="inviteCodeVisible" />
  </Transition>
</template>

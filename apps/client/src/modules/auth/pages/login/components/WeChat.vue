<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

import type { LoginMode } from '@auth/types'
import authApi from '@auth/api'

const mode = defineModel<LoginMode>({ required: true })

const nonce = ref('')
const imageURL = ref('')
const expiredMask = ref(false)
const router = useRouter()
const { t } = useI18n()

onMounted(() => refreshQrcode())

function refreshQrcode() {
  expiredMask.value = false

  const response = authApi.getQrcode()
  response.then(({ data }) => {
    imageURL.value = data.qrcodeUrl
    nonce.value = data.nonce
    validQrcode()
  })
}

function validQrcode() {
  const response = authApi.checkQrcode(nonce.value)
  const key = import.meta.env.VITE_ACCESS_TOKEN

  response.then(async ({ data }) => {
    localStorage.setItem(key, data)
    await router.push('/')
  })

  response.finally(() => {
    expiredMask.value = true
  })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-4 h-full">
    <h2 class="text-xl font-bold">{{ t('auth.method.wechat') }}</h2>
    <div class="relative overflow-hidden w-44 h-44 border rounded-lg select-none">
      <img
        v-if="imageURL"
        :src="imageURL"
        :class="expiredMask ? 'opacity-50' : ''"
        alt="Qrcode" draggable="false"
      >
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="w-10 h-10 border rounded-full flex items-center justify-center">
          <Icon icon="lucide:scan" class="size-4" />
        </div>
      </div>
      <div
        v-show="expiredMask"
        :class="twJoin(
          'absolute top-0 bottom-0 left-0 right-0',
          'flex items-center justify-center bg-white/90'
        )"
      >
        <a
          href="javascript:void(0)"
          :class="twJoin(
            'flex flex-col items-center space-y-2',
            'text-sm text-muted-foreground hover:text-primary'
          )"
          @click="refreshQrcode"
        >
          <Icon icon="lucide:rotate-cw" class="size-4" />
          <span>{{ t('auth.refresh') }}</span>
        </a>
      </div>
    </div>
    <a
      href="javascript:void(0)"
      :class="twJoin(
        'flex items-center space-x-2',
        'text-muted-foreground text-sm hover:underline'
      )"
      @click="mode = 'account'"
    >
      {{ t('auth.backTo', { action: t('auth.method.account') }) }}
    </a>
  </div>
</template>

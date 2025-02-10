<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { LoginMode } from '../types'
import authApi from '@/api/auth'

const mode = defineModel<LoginMode>({ required: true })

const router = useRouter()

const nonce = ref('')
const imageURL = ref('')
const expiredMask = ref(false)

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
  <div class="flex flex-col items-center justify-center gap-4 h-full">
    <h2 class="text-xl font-bold">微信扫码登录</h2>
    <div class="relative overflow-hidden w-44 h-44 border rounded-lg select-none">
      <img v-if="imageURL" :src="imageURL" alt="Qrcode" draggable="false" :class="expiredMask ? 'opacity-50' : ''">
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="w-10 h-10 border rounded-full flex items-center justify-center">
          <Icon icon="lucide:scan" class="size-4" />
        </div>
      </div>
      <div v-show="expiredMask" class="absolute inset-0 flex items-center justify-center bg-white/90">
        <a href="javascript:void(0)" class="flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-primary" @click="refreshQrcode">
          <Icon icon="lucide:rotate-cw" class="size-4" />
          <span>点击刷新</span>
        </a>
      </div>
    </div>
    <a href="javascript:void(0)" class="flex items-center gap-2 text-muted-foreground text-sm hover:underline" @click="mode = 'account'">
      返回账号登录
    </a>
  </div>
</template>

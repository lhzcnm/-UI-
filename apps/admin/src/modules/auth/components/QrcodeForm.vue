<script setup lang="ts">
import { Icon } from '@iconify/vue'
import authApi from '../api'

const router = useRouter()

const timer = ref<number>()
const qrcode = reactive({
  nonce: '',
  imageURL: '',
  expired: false,
})

onMounted(() => refreshQrcode())
onBeforeUnmount(() => clearTimeout(timer.value!))

function refreshQrcode() {
  qrcode.expired = false

  const response = authApi.getLoginQrcode()
  response.then(({ data }) => {
    qrcode.nonce = data.nonce
    qrcode.imageURL = data.qrcodeUrl

    timer.value = window.setInterval(() => wechatLogin(), 1300)
    setTimeout(() => setExpired(), 1000 * 60)
  })
}

function setExpired() {
  qrcode.expired = true
  qrcode.nonce = ''
  qrcode.imageURL = ''

  clearTimeout(timer.value!)
}

function wechatLogin() {
  const response = authApi.verifyLoginQrcode(qrcode.nonce)
  
  response.then(async ({ data, code }) => {
    if (code !== 200) return
    
    localStorage.setItem(
      import.meta.env.VITE_ACCESS_TOKEN,
      data,
    )

    setExpired()
    await router.push('/')
  })

  response.catch(() => setExpired())
}
</script>

<template>
  <div class="space-y-5 text-center max-sm:mb-3">
    <div class="flex justify-center">
      <div class="size-48 rounded-md bg-white p-2 shadow-sm">
        <div 
          class="relative flex size-full items-center justify-center rounded-md border-2 border-dashed border-zinc-200"
          :class="{ 'cursor-pointer': qrcode.expired }"
        >
          <template v-if="qrcode.expired">
            <a
              href="javascript:void(0)"
              class="block text-center"
              @click="refreshQrcode"
            >
              <Icon icon="lucide:refresh-cw" class="size-16 text-zinc-300" />
              <p class="mt-2 text-xs text-zinc-400">二维码已过期<br>点击刷新</p>
            </a>
          </template>

          <template v-else-if="qrcode.imageURL">
            <img :src="qrcode.imageURL" alt="登录二维码" class="size-full rounded" />
          </template>

          <template v-else>
            <Icon icon="lucide:qr-code" class="size-16 text-zinc-300" />
          </template>
        </div>
      </div>
    </div>
    <p class="text-sm text-secondary-foreground">微信扫一扫登录</p>
  </div>
</template>

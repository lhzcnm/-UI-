<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

import { userApi } from '@/api/user'
import { toast } from 'vue-sonner'

const imageURL = ref('')
const { t } = useI18n()
const uStore = useUserStore()
const expiredMask = ref(false)

onMounted(async () => getQRCode())

async function getQRCode() {
  try {
    expiredMask.value = false
    const res = await userApi.bindWechat()
    imageURL.value = res.data
    await checkQRCode()
  } catch {}
}

async function checkQRCode() {
  try {
    await userApi.checkWechat(uStore.info.userId)
    toast.success("绑定成功, 请重新登录")
    setTimeout(() => {
      uStore.logout()
    }, 1500)
  } catch {} finally {
    expiredMask.value = true
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-4">
    <div class="size-40 border rounded-lg overflow-hidden">
      <div v-if="imageURL" class="relative overflow-hidden border rounded-lg select-none">
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
            @click="getQRCode"
          >
            <Icon icon="lucide:rotate-cw" class="size-4" />
            <span>{{ t('auth.refresh') }}</span>
          </a>
        </div>
      </div>
      <div v-else class="size-full flex items-center justify-center">
        <div class="size-10 border rounded-full flex items-center justify-center">
          <Icon icon="lucide:scan" />
        </div>
      </div>
    </div>
    <p class="text-sm text-muted-foreground">{{ t('profile.placeholder.wechat') }}</p>
  </div>
</template>

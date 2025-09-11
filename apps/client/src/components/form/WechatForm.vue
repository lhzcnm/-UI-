<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { userApi } from '@/api/user'

const imageURL = ref('')
const { t } = useI18n()

onMounted(async () => getQRCode())

async function getQRCode() {
  const res = await userApi.bindWechat()
  imageURL.value = res.data
}
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-4">
    <div class="size-40 border rounded-lg overflow-hidden">
      <img v-if="imageURL" :src="imageURL" alt="WeChat QR Code" class="size-full">
      <div v-else class="size-full flex items-center justify-center">
        <div class="size-10 border rounded-full flex items-center justify-center">
          <Icon icon="lucide:scan" />
        </div>
      </div>
    </div>
    <p class="text-sm text-muted-foreground">{{ t('profile.placeholder.wechat') }}</p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { ua } from '@3un/utils'
import axios from 'axios'
import { twMerge } from 'tailwind-merge'

interface SlideRightEmits {
  (e: 'close'): void
}

const store = useUserStore()

const emit = defineEmits<SlideRightEmits>()
const visible = defineModel<boolean>({ default: false })
const inviteImg = ref<string>('')

const { t } = useI18n()

const baseUrl = import.meta.env.VITE_API_URL

watch(visible, (value) => !value && emit('close'))

async function generInviteCodeImg() {
  const { data } = await axios.get(
    `${baseUrl}/wx/invite/${store.info.openId}`,
    {
      responseType: 'blob',
      headers: {
        Authorization: localStorage.getItem('access_token')
      }
    })

  inviteImg.value = URL.createObjectURL(data)

  if(ua.isWechat) {
    showTip()
  } else {
    downloadFile(inviteImg.value)
  }

  setTimeout(() => URL.revokeObjectURL(inviteImg.value), 1000)
}

function showTip() {
  if(ua.isMobile && ua.isWechat && ua.os.toLowerCase() !== 'ios') {
    alert(t('profile.mobile.prompt.download'))
  }
}

function downloadFile(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = 'inviteCode.jpg'

  a.click()
}

onMounted(async () => {
  await generInviteCodeImg()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="absolute top-0 bottom-0 left-0 right-0 z-30 flex flex-col bg-background">
      <section :class="twMerge('relative flex items-center px-3 h-mobile-header border-b border-border justify-between')">
        <div class="flex items-center">
          <button class="absolute left-3 text-muted-foreground" @click="visible = false">
            <Icon icon="lucide:chevron-left" class="size-6" />
          </button>
          <div class="pl-9 text-lg font-medium truncate">{{ t('profile.mobile.setting.invite') }}</div>
        </div>
        <XButton size="sm" :label="t('profile.mobile.prompt.inviteCode')" @click="downloadFile" />
      </section>
      <template v-if="inviteImg !== ''">
        <section class="flex-1 overflow-y-auto">
          <div class="p-4 flex flex-col items-center justify-center space-y-4">
            <img :src="inviteImg" alt="">
          </div>
        </section>
      </template>
      <template v-else>
        <Fallback />
      </template>
    </div>
  </Teleport>
</template>
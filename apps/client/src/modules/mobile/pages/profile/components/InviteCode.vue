<script setup lang="ts">
import { ua } from '@3un/utils'
import axios from 'axios'

const store = useUserStore()

const inviteImg = ref('')

const { t } = useI18n()

const baseUrl = import.meta.env.VITE_API_URL

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

await generInviteCodeImg()
</script>

<template>
  <div class="p-4">
    <img :src="inviteImg" alt="">
  </div>
</template>
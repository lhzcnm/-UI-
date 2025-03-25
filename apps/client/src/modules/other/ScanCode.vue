<script setup lang="ts">
import '@jweixin/index'

import { ua } from '@3un/utils'
import { wxApi } from '@/api/wx'

await getWxConfig()

async function getWxConfig() {
  const url = location.href.split('#')[0]
  const encode = encodeURIComponent(url)
  const { data } = await wxApi.config(encode)

  window.wx.config({ ...data, jsApiList: ['scanQRCode'] })
  window.wx.ready(onScanCode)
}

function onScanCode() {
  const params = new URL(location.href).searchParams
  const openId = params.get('openid')

  window.wx.scanQRCode({
    needResult: 1,
    scanType: ['qrCode', 'barCode'],
    fail: ({ errMsg }) => window.alert(errMsg),
    cancel: () => handleClose(),
    success: ({ resultStr }) => {
      const imei = resultStr.split(',')[1]
      const response = wxApi.scanCode({
        openId: openId!,
        code: imei,
      })

      response.finally(() => handleClose())
    },
  })
}

function closeWindow() {
  return window.WeixinJSBridge?.call('closeWindow')
}

function handleClose() {
  closeWindow()
  document.addEventListener(
    'WeixinJSBridgeReady',
    closeWindow,
    false,
  )
}
</script>

<template>
  <div
    v-show="ua.isWechat && ua.isDesktop"
    class="p-8 text-center text-muted-foreground"
  >
    PC 端不支持扫码，请使用手机扫码
  </div>
</template>

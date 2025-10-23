<script setup lang="ts">
import BaseForm from '../components/service/BaseForm.vue'
import ServiceDetail from '../components/service/ServiceDetail.vue'

import { toast } from 'vue-sonner'
import { EMAIL_REG, PHONE_REG } from '@3un/utils'

import type { FormType } from '../utils/types'
import { SERVICE_STORE } from '../utils/symbol'
import { getSubmitImei, validate, type ValidRule } from '@/utils'
import ConfirmDialog from '../components/service/ConfirmDialog.vue'
import type { StorePayParams } from '../api/types'
import { checkQrcode, storePay } from '../api'
import QrcodeDialog from '../components/service/QrcodeDialog.vue'

const store = inject(SERVICE_STORE)!

const form = reactive<FormType>({
  serviceId: store.selectService.id,
  price: 0,
  imei: '',
  pushRes: true,
  phone: '',
  mail: '',
})

let timer: ReturnType<typeof setInterval> | null = null

function handleCancel() {
  store.storeStatus = "serviceStore"
}

function handleConfirm() {
  const rules: ValidRule[] = []
  if(form.pushRes) {
    if(!form.phone && !form.mail) {
      return toast.warning("请输入手机号或邮箱")
    }
  }

  if(form.phone) {
    rules.push({
      rule: PHONE_REG.test(form.phone),
      message: "请输入正确的手机号",
    })
  }

  if(form.mail) {
    rules.push({
      rule: EMAIL_REG.test(form.mail),
      message: "请输入正确的邮箱",
    })
  }

  rules.push({
    rule: !!form.imei,
    message: "请输入imei/sn"
  })

  if(!validate(rules)) return

  store.imeiList.length = 0
  formatImei()

  store.visibleConfirm = true

  console.log(store.imeiList)
}

function formatImei() {
  let allImeis: string[] = []
  const imeis = form.imei.split('\n')

  for(const item of imeis) {
    const imeiArr = item.split(',')

    for(const imei of imeiArr) {
      allImeis.push(imei)
    }
  }

  allImeis = [...new Set(allImeis)]

  const imeiType = store.selectService.imeiType
  store.imeiList = getSubmitImei(allImeis.join('\n'), imeiType)
}

function handleSubmit() {
  const params: StorePayParams = {
    id: '1',
    amount: store.imeiList.length * +store.selectService.storePrice,
    type: store.payType
  }

  storePay(params).then(({ data }) => {
    store.url = data
    store.visibleQrcode = true

    validQrcode()
  }).catch(() => {
    return toast.warning("生成支付二维码失败, 请尝试重新提交")
  })
}

function validQrcode() {
  timer = setInterval(() => {
    checkQrcode().then(({ data }) => {
      if(data) {
        store.visibleQrcode = false
        if(timer) {
          clearInterval(timer)
        }
      }
    })
  }, 1300)
}

function handleClearInterval() {
  if(timer) {
    clearInterval(timer)
  }
}

onMounted(() => {
  history.pushState(null, '', location.href)
  window.addEventListener('popstate', () => {
    store.storeStatus = "serviceStore"
  })
})

onBeforeUnmount(() => {
  handleClearInterval()
})
</script>

<template>
  <div class="flex-1 flex space-x-8">
    <section class="min-w-[10rem] max-w-[32rem] border h-full">
      <ServiceDetail :service="store.selectService" />
    </section>
    <section class="flex-1 flex flex-col">
      <div class="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-xl">
        <BaseForm
          :service="store.selectService" v-model="form"
          @cancel="handleCancel" @confirm="handleConfirm"/>
      </div>
    </section>
    <section class="min-w-[24rem] max-w-[36rem] border h-full overflow-y-auto"></section>

    <ConfirmDialog @submit="handleSubmit" />
    <QrcodeDialog />
  </div>
</template>

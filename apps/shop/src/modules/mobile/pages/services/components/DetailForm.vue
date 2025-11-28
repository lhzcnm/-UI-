<script setup lang="ts">
import { EMAIL_REG, IMEI_TYPE_MAP, PHONE_REG } from '@3un/utils'
import RandExp from 'randexp'
import { toast } from 'vue-sonner'

import type { DetailStepEmits, FormType } from '../utils/types'
import { validate, type ValidRule } from '@/utils/validate'
import { getSubmitImei } from '@/utils/common'

const shopStore = useShopStore()

const form = reactive<FormType>({
  imei: shopStore.createOrder.imeiList.join('\n'),
  pushRes: shopStore.createOrder.isPushNotification,
  phone: shopStore.createOrder.phoneNumber,
  mail: shopStore.createOrder.email,
})

const { t } = useI18n()

const emits = defineEmits<DetailStepEmits>()

const imeiPlaceholder = computed(() => {
  let res = `${t(IMEI_TYPE_MAP[shopStore.selService!.imeiType].key!)}, ${t('shop.prompt.imei')}\n${t('shop.form.example')}:\n`
  const samples = Array.from({ length: 5 }, () => new RandExp(IMEI_TYPE_MAP[shopStore.selService!.imeiType].regex).gen())
    .map(item => item.replace(/\s+/g, ''))
    .join('\n')

  return res + samples
})

function handleConfirm() {
  const rules: ValidRule[] = []

  if(shopStore.selService!.isUnlock) {
    if(!form.pushRes) {
      return toast.warning("解锁类服务必须启用推送结果")
    }
  }

  if(form.pushRes) {
    if(!form.phone && !form.mail) {
      return toast.warning(t('shop.prompt.pushSource'))
    }
  }

  if(form.phone) {
    rules.push({
      rule: PHONE_REG.test(form.phone),
      message: t('valid.profile.email_format'),
    })
  }

  if(form.mail) {
    rules.push({
      rule: EMAIL_REG.test(form.mail),
      message: t('valid.profile.phone_format'),
    })
  }

  rules.push({
    rule: !!form.imei,
    message: t('valid.shop.imeiNull')
  })

  if(!validate(rules)) return

  // store.createOrder.imeiList.length = 0

  shopStore.createOrder = {
    serviceId: shopStore.selService!.id.toString(),
    groupId: shopStore.selService!.parentId.toString(),
    imeiList: formatImei(form.imei),
    isPushNotification: form.pushRes,
    phoneNumber: form.phone,
    email: form.mail,
    isBulk: false,
  }

  emits('next', 'pay')
}

function formatImei(str: string) {
  let allImeis: string[] = []
  const imeis = str.split('\n')

  for(const item of imeis) {
    const imeiArr = item.split(',')

    for(const imei of imeiArr) {
      allImeis.push(imei)
    }
  }

  allImeis = [...new Set(allImeis)]

  const imeiType = shopStore.selService!.imeiType
  return getSubmitImei(allImeis.join('\n'), imeiType)
}
</script>

<template>
  <form ref="OrderFormRef" class="w-full flex flex-col space-y-6 p-5 border border-border bg-white dark:bg-black rounded-lg dark:shadow-zinc-900">
    <div class="flex items-center space-x-2">
      <div class="w-2 h-6 bg-primary rounded"></div>
      <span class="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">{{ t('shop.form.title') }}</span>
    </div>
    <div>
      <textarea
        rows="7"
        :placeholder="imeiPlaceholder"
        class="w-full p-3 rounded-xl border border-border bg-white/60 dark:bg-slate-800/60 
               backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        v-model="form.imei"
      ></textarea>
    </div>

    <div v-if="!shopStore.selService!.isUnlock" class="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
      <input
        type="checkbox"
        id="pushRes"
        v-model="form.pushRes"
        class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label for="pushRes" class="cursor-pointer select-none">
        {{ t('shop.form.push') }}
      </label>
    </div>

    <div v-show="form.pushRes" class="flex flex-col space-y-2">
      <label class="flex flex-col w-full text-sm text-zinc-600 dark:text-zinc-400">
        <span class="mb-1 font-medium">{{ t('shop.form.mail') }}</span>
        <input
          type="email"
          :placeholder="t('shop.form.mail')"
          v-model="form.mail"
          class="w-full p-2 rounded-lg border border-border bg-white/60 dark:bg-slate-800/60
                 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        />
      </label>

      <label class="flex flex-col w-full text-sm text-zinc-600 dark:text-zinc-400">
        <span class="mb-1 font-medium">{{ t('shop.form.phone') }}</span>
        <input
          type="text"
          :placeholder="t('shop.form.phone')"
          v-model="form.phone"
          class="w-full p-2 rounded-lg border border-border bg-white/60 dark:bg-slate-800/60
                 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        />
      </label>
    </div>

    <div class="flex justify-end space-x-4 pt-2">
      <XButton variant="outline" :label="t('shop.step.prev')" @click.prevent="emits('prev', 'view')" />
      <XButton :label="t('shop.step.next')" @click.prevent="handleConfirm" />
    </div>
  </form>
</template>

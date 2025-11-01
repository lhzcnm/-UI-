<script setup lang="ts">
import type { DetailStepEmits, FormType } from '@mobile/pages/store/utils/types'

import { EMAIL_REG, IMEI_TYPE_MAP, PHONE_REG } from '@3un/utils'
import { SERVICE_STORE } from '@mobile/pages/store/utils/symbol'
import RandExp from 'randexp'
import { getSubmitImei, validate, type ValidRule } from '@/utils'
import { toast } from 'vue-sonner'

const store = inject(SERVICE_STORE)!

const service = store.selService!

const form = reactive<FormType>({
  imei: store.createOrder.imeiList.join('\n'),
  pushRes: store.createOrder.isPushNotification,
  phone: store.createOrder.phoneNumber,
  mail: store.createOrder.email,
})

const { t } = useI18n()

const emits = defineEmits<DetailStepEmits>()

const imeiPlaceholder = computed(() => {
  let res = `${t(IMEI_TYPE_MAP[service.imeiType].key!)}, ${t('store.prompt.imei')}\n示例:\n`
  const samples = Array.from({ length: 5 }, () => new RandExp(IMEI_TYPE_MAP[service.imeiType].regex).gen())
    .map(item => item.replace(/\s+/g, ''))
    .join('\n')

  return res + samples
})

function handleConfirm() {
  const rules: ValidRule[] = []

  if(service.isUnlock) {
    if(!form.pushRes) {
      return toast.warning("解锁类服务必须启用推送结果")
    }
  }

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

  store.createOrder.imeiList.length = 0

  store.createOrder = {
    serviceId: service.id.toString(),
    groupId: service.parentId,
    imeiList: formatImei(form.imei),
    isBulk: true,
    isPushNotification: form.pushRes,
    phoneNumber: form.phone,
    email: form.mail,
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

  const imeiType = service.imeiType
  return getSubmitImei(allImeis.join('\n'), imeiType)
}

onMounted(() => {

})
</script>

<template>
  <form ref="OrderFormRef" class="w-full flex flex-col space-y-6 p-5 border border-border bg-white dark:bg-black rounded-lg dark:shadow-zinc-900">
    <div class="flex items-center space-x-2">
      <div class="w-2 h-6 bg-primary rounded"></div>
      <span class="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">填写信息</span>
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

    <div v-if="!service.isUnlock" class="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
      <input
        type="checkbox"
        id="pushRes"
        v-model="form.pushRes"
        class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label for="pushRes" class="cursor-pointer select-none">
        {{ t('mall.submit.push') }} ({{ t('mall.submit.recommend') }})
      </label>
    </div>

    <div v-show="form.pushRes" class="flex flex-col space-x-3">
      <label class="flex flex-col w-full text-sm text-zinc-600 dark:text-zinc-400">
        <span class="mb-1 font-medium">手机号</span>
        <input
          type="text"
          :placeholder="t('mall.submit.phone')"
          v-model="form.phone"
          class="w-full p-2 rounded-lg border border-border bg-white/60 dark:bg-slate-800/60
                 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        />
      </label>

      <label class="flex flex-col w-full text-sm text-zinc-600 dark:text-zinc-400">
        <span class="mb-1 font-medium">邮箱</span>
        <input
          type="email"
          :placeholder="t('mall.submit.mail')"
          v-model="form.mail"
          class="w-full p-2 rounded-lg border border-border bg-white/60 dark:bg-slate-800/60
                 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        />
      </label>
    </div>

    <div class="flex justify-end space-x-4 pt-2">
      <XButton variant="outline" label="上一步" @click.prevent="emits('prev', 'view')" />
      <XButton label="下一步" @click.prevent="handleConfirm" />
    </div>
  </form>
</template>

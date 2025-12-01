<script setup lang="ts">
import RandExp from 'randexp'

import { type OrderForm } from '@/inters/order'
import { validate, type ValidRule } from '@/utils/validate'
import { EMAIL_REG, IMEI_TYPE_MAP, PHONE_REG } from '@3un/utils'
import type { Service } from '@/inters/services'
import { DETAIL_STORE } from '../utils'
import { getSubmitImei } from '@/utils/common'

interface BaseFormProps {
  service: Service,
}

interface BaseFormEmits {
  confirm: [],
}

const store = inject(DETAIL_STORE)!

const props = defineProps<BaseFormProps>()
const form = defineModel<OrderForm>({ required: true })
const emits = defineEmits<BaseFormEmits>()

const { t } = useI18n()
// const router = useRouter()

const imeiPlaceholder = computed(() => {
  let res = `${t(IMEI_TYPE_MAP[props.service.imeiType].key!)}, ${t('shop.prompt.imei')}\n${t('shop.form.example')}:\n`
  const samples = Array.from({ length: 5 }, () => new RandExp(IMEI_TYPE_MAP[props.service.imeiType].regex).gen())
    .map(item => item.replace(/\s+/g, ''))
    .join('\n')

  return res + samples
})

function getRules() {
  const rules: ValidRule[] = [
    { rule: !!form.value.imei, message: t('valid.shop.imeiNull') }
  ]

  // if(props.service.isUnlock) {
  //   rules.push({
  //     rule: form.value.pushRes, message: t('shop.prompt.unlock')
  //   })
  // }

  if(form.value.pushRes) {
    rules.push({
      rule: !!form.value.phone || !!form.value.mail,
      message: t('shop.prompt.pushSource'),
    })
  }

  if(form.value.mail) {
    rules.push({
      rule: EMAIL_REG.test(form.value.mail),
      message: t('valid.profile.email_format'),
    })
  }

  if(form.value.phone) {
    rules.push({
      rule: PHONE_REG.test(form.value.phone),
      message: t('valid.profile.phone_format'),
    })
  }

  return rules
}

// function handleBack() {
//   router.go(-1)
// }

function handleConfirm() {
  const rules = getRules()

  if(!validate(rules)) return

  store.submitForm = {
    serviceId: props.service.id.toString(),
    groupId: props.service.parentId.toString(),
    imeiList: formatImei(),
    isPushNotification: form.value.pushRes,
    phoneNumber: form.value.phone,
    email: form.value.mail,
    isBulk: false,
  }

  emits('confirm')
}

function formatImei() {
  let allImeis: string[] = []
  const imeis = form.value.imei.split('\n')

  for(const item of imeis) {
    const imeiArr = item.split(',')

    for(const imei of imeiArr) {
      allImeis.push(imei)
    }
  }

  allImeis = [...new Set(allImeis)]

  const imeiType = props.service.imeiType
  return getSubmitImei(allImeis.join('\n'), imeiType)
}
</script>

<template>
  <div class="w-full gap-4">
      <form
        ref="OrderFormRef"
        class="w-full flex flex-col space-y-6 p-5 border border-border bg-white dark:bg-black rounded-lg shadow-lg dark:shadow-zinc-900"
      >
        <div class="flex items-center space-x-2">
          <div class="w-2 h-6 bg-primary rounded"></div>
          <span class="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">
            {{ t('shop.form.title') }}
          </span>
        </div>

        <textarea
          rows="7"
          :placeholder="imeiPlaceholder"
          class="w-full p-3 rounded-xl border border-border bg-white/60 dark:bg-slate-800/60 
                 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
          v-model="form.imei"
        ></textarea>

        <div
          v-if="!service.isUnlock"
          class="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400"
        >
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

        <div v-show="form.pushRes" class="flex space-x-3">
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

        <div class="flex justify-center space-x-4 pt-2">
          <!-- <XButton class="w-32" :label="t('shop.form.cancel')" variant="outline" @click.prevent="handleBack" /> -->
          <XButton
            class="w-72 text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
            :label="t('shop.form.confirm')"
            @click.prevent="handleConfirm"
          />
        </div>
      </form>

  </div>
</template>

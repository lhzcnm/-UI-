<script setup lang="ts">
import { IMEI_TYPE_MAP } from '@3un/utils'

import type { FormType } from '@desktop/pages/store/utils/types'
import type { ServiceItem } from '../../api/types'

interface BaseFormProps {
  service: ServiceItem,
}

interface BaseFormEmits {
  cancel: [],
  confirm: [],
}

const store = useSettingStore()

defineProps<BaseFormProps>()
const form = defineModel<FormType>({ required: true })
const emits = defineEmits<BaseFormEmits>()

const { t, locale } = useI18n()

const prompt = computed(() => {
  return locale.value === 'zh'
    ? store.settings.mallWarmReminderZH
    : store.settings.mallWarmReminderEN
      ? store.settings.mallWarmReminderEN
      : store.settings.mallWarmReminderZH
})

function handleBack() {
  emits('cancel')
}

function handleConfirm() {
  emits('confirm')
}
</script>

<template>
  <form ref="OrderFormRef" class="w-full p-1 flex flex-col space-y-2">
    <div class="">
      <textarea
        rows="6"
        :placeholder="t(IMEI_TYPE_MAP[service.imeiType].key!) + ', ' + t('store.prompt.imei')"
        class="w-full p-2 border bg-transparent border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-priamry "
        v-model="form.imei"
      ></textarea>
    </div>

    <div class="mb-4 flex items-center space-x-1 text-gray-500">
      <input
        type="checkbox"
        id="pushRes"
        v-model="form.pushRes"
        class="w-4 h-4 rounded bg-transparent border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label for="pushRes" class="cursor-pointer select-none">
        {{ t('mall.submit.push') }}({{ t('mall.submit.recommend') }})
      </label>
    </div>

    <div v-show="form.pushRes" class="mb-4">
      <label class="block mb-1 text-gray-600">{{ t('mall.submit.pushHit') }}</label>
      <div class="flex flex-col space-y-2">
        <input
          type="text"
          :placeholder="t('mall.submit.phone')"
          v-model="form.phone"
          class="w-full p-2 border bg-transparent border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          :placeholder="t('mall.submit.mail')"
          v-model="form.mail"
          class="w-full p-2 border bg-transparent border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <div class="flex justify-end space-x-2">
      <XButton class="w-32" label="返回" variant="outline" @click.prevent="handleBack" />
      <XButton class="w-72" label="确认下单" @click.prevent="handleConfirm" />
    </div>

    <div class="flex flex-col">
      <span class="text-xl">下单提醒</span>
      <div class="px-8 py-2" v-html="prompt"></div>
    </div>
  </form>
</template>

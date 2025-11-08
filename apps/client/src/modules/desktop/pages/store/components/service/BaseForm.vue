<script setup lang="ts">
import { IMEI_TYPE_MAP } from '@3un/utils'
import RandExp from 'randexp'

import type { FormType } from '@desktop/pages/store/utils/types'
import type { ServiceItem } from '@/api/store/types'

interface BaseFormProps {
  service: ServiceItem,
}

interface BaseFormEmits {
  cancel: [],
  confirm: [],
}

const props = defineProps<BaseFormProps>()
const form = defineModel<FormType>({ required: true })
const emits = defineEmits<BaseFormEmits>()

const { t } = useI18n()

const imeiPlaceholder = computed(() => {
  let res = `${t(IMEI_TYPE_MAP[props.service.imeiType].key!)}, ${t('store.prompt.imei')}\n${t('store.form.example')}:\n`
  const samples = Array.from({ length: 5 }, () => new RandExp(IMEI_TYPE_MAP[props.service.imeiType].regex).gen())
    .map(item => item.replace(/\s+/g, ''))
    .join('\n')

  return res + samples
})

function handleBack() {
  emits('cancel')
}

function handleConfirm() {
  emits('confirm')
}
</script>

<template>
  <form ref="OrderFormRef" class="w-full flex flex-col space-y-6 p-5 border border-border bg-white dark:bg-black rounded-lg shadow-lg dark:shadow-zinc-900">
    <div class="flex items-center space-x-2">
      <div class="w-2 h-6 bg-primary rounded"></div>
      <span class="block text-lg font-semibold text-zinc-800 dark:text-zinc-200">{{ t('store.form.title') }}</span>
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
        {{ t('store.form.push') }}
      </label>
    </div>

    <div v-show="form.pushRes" class="flex space-x-3">
      <label class="flex flex-col w-full text-sm text-zinc-600 dark:text-zinc-400">
        <span class="mb-1 font-medium">{{ t('store.form.phone') }}</span>
        <input
          type="text"
          :placeholder="t('store.form.phone')"
          v-model="form.phone"
          class="w-full p-2 rounded-lg border border-border bg-white/60 dark:bg-slate-800/60
                 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        />
      </label>

      <label class="flex flex-col w-full text-sm text-zinc-600 dark:text-zinc-400">
        <span class="mb-1 font-medium">{{ t('store.form.mail') }}</span>
        <input
          type="email"
          :placeholder="t('store.form.mail')"
          v-model="form.mail"
          class="w-full p-2 rounded-lg border border-border bg-white/60 dark:bg-slate-800/60
                 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
        />
      </label>
    </div>

    <div class="flex justify-center space-x-4 pt-2">
      <XButton class="w-32" :label="t('store.form.cancel')" variant="outline" @click.prevent="handleBack" />
      <XButton
        class="w-72 text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
        :label="t('store.form.confirm')" @click.prevent="handleConfirm"
      />
    </div>
  </form>
</template>


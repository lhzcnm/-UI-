<script setup lang="ts">
import { IMEI_TYPE_MAP } from '@3un/utils'

import type { Service } from '@/api/services'
import type { FormType } from '../utils/types'

interface FormProps {
  service: Service,
}

defineProps<FormProps>()
const form = defineModel<FormType>({ required: true })

const { t } = useI18n()
</script>

<template>
  <XForm class="max-h-[40rem] overflow-y-auto" style="scrollbar-width: none;">
    <XFormItem label="服务">
      <XInput disabled :model-value="service.title" />
    </XFormItem>
    <XFormItem v-if="service.mustRead" label="服务说明">
      <div
        class="py-2 bg-zinc-100 dark:bg-zinc-800 border border-border rounded">
        <span class="" v-html="service.mustRead"></span>
      </div>
    </XFormItem>
    <XFormItem v-if="service.mustRead" label="提交类型">
      <div
        class="p-2 bg-zinc-100 dark:bg-zinc-800 border border-border rounded text-muted-foreground">
        <span class="">{{ t(IMEI_TYPE_MAP[service.imeiType].key!) }}</span>
      </div>
    </XFormItem>
    <XFormItem label="服务价格">
      <div class="p-2 text-muted-foreground bg-zinc-100 dark:bg-zinc-800 border border-border rounded">
        <span>￥{{ service.price }}</span>
      </div>
    </XFormItem>
    <XFormItem :label="IMEI_TYPE_MAP[service.imeiType ?? 5].label">
      <XInput :placeholder="t(IMEI_TYPE_MAP[service.imeiType ?? 5].key!)" v-model="form.imei" />
    </XFormItem>
    <XFormItem label="推送结果">
      <div class="flex items-center space-x-1 text-muted-foreground">
        <XSwitch v-model="form.pushRes" />
        <span>推送结果(推荐开启)</span>
      </div>
    </XFormItem>
    <XFormItem v-show="form.pushRes" label="推送手机号/邮箱">
      <div class="flex flex-col space-y-2">
        <XInput placeholder="请填写推送手机号" v-model="form.phone" />
        <XInput placeholder="请填写推送邮箱" v-model="form.mail" />
      </div>
    </XFormItem>
  </XForm>
</template>

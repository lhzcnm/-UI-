<script setup lang="ts">
import type { Configs, Settings } from '@/inters/settings'
import { updateSetting, updateConfig, updateThread } from '@/api/settings'
import { toast } from 'vue-sonner'
import { handleInputChange } from '@/utils'

interface SettingPlaneProps {
  settings: Settings
  configs: Configs
}

const props =
  defineProps<SettingPlaneProps>()

const loading = ref(false)
const form = reactive({
  enableRegister: props.settings.enableRegister,
  enableOrderVerify: props.settings.enableOrderVerify,
  queryValidation: props.settings.queryValidation,
  unlockValidation: props.settings.unlockValidation,
  minRechargeAmount: props.settings.minRechargeAmount,
  maxRechargeAmount: props.settings.maxRechargeAmount,
  minVoucherAmount: props.settings.minVoucherAmount ?? 0,
  maxVoucherAmount: props.settings.maxVoucherAmount ?? 0,
  invitePonit: +props.configs['invite:point'],
  inviteForPonit: +props.configs['invite:for:point'],
  excludedWords: props.configs['filter:excluded_words']
    ? JSON.parse(props.configs['filter:excluded_words']).join('|')
    : '',
  invite: props.settings.invite,
  threads: props.settings.threads ?? 5,
  autoCleanEnable: props.settings["AutoCleanEnable"],
  orderRetainDays: props.settings["OrderRetainDays"],
  autoCreditCleanEnable: props.settings["AutoCleanCreditsEnable"],
  creditsRetainDays: props.settings["creditsRetainDays"],
})

const iStore = useSystemStore()

function handleSubmit() {
  if (form.orderRetainDays < 30) {
    return toast.warning("历史订单至少需要保留30天")
  }
  loading.value = true

  const response = Promise.all([
    updateSetting([
      { name: 'enableRegister', status: form.enableRegister },
      { name: 'enableOrderVerify', status: form.enableOrderVerify },
      // { name: 'enableTricket', status: form.enableTricket },
      { name: 'queryValidation', status: form.queryValidation },
      { name: 'unlockValidation', status: form.unlockValidation },
      { name: 'minRechargeAmount', content: form.minRechargeAmount.toString() },
      { name: 'maxRechargeAmount', content: form.maxRechargeAmount.toString() },
      { name: 'minVoucherAmount', content: form.minVoucherAmount.toString() },
      { name: 'maxVoucherAmount', content: form.maxVoucherAmount.toString() },
      { name: 'invite', content: form.invite },
      { name: 'AutoCleanEnable', status: form.autoCleanEnable },
      { name: 'OrderRetainDays', content: form.orderRetainDays.toString() },
      { name: 'AutoCleanCreditsEnable', status: form.autoCreditCleanEnable },
      { name: 'creditsRetainDays', content: form.creditsRetainDays.toString() },
    ]),
    updateConfig([
      { key: 'invite:point', value: form.invitePonit.toString() },
      { key: 'invite:for:point', value: form.inviteForPonit.toString() },
      {
        key: 'filter:excluded_words',
        value: JSON.stringify(
          form.excludedWords.split('|')
            .map((word: string) => word.trim())
            .filter(Boolean)
          )
      },
    ]),
    updateThread(form.threads),
  ])

  response.then(() => {
    toast.success('修改成功')
    iStore.showSetting = false
    iStore.getSetting()
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 divide-y px-6 pb-4 overflow-y-auto">
      <FormField
        label="受邀请积分"
        desc="用户填写邀请码后获得的积分"
        :content-flex="false"
      >
        <XInputNumber :precision="2" :step="0.01" v-model="form.inviteForPonit" />
      </FormField>
      <FormField
        label="邀请积分"
        desc="邀请用户获得的积分"
        :content-flex="false"
      >
        <XInputNumber :precision="2" :step="0.01" v-model="form.invitePonit" />
      </FormField>

      <FormField
        label="公众号提交线程数"
        desc="设置公众号提交订单的线程数"
        :content-flex="false"
      >
        <XInputNumber :precision="0" :step="1" :min="1" :max="20" v-model="form.threads" />
      </FormField>

      <FormField
        label="推荐码文本"
        desc="推荐码生成公众号发送文本"
        variant="vertical"
      >
        <XTextarea class="h-32" v-model="form.invite" />
      </FormField>
  
      <FormField
        label="最小充值金额"
        desc="用户充值时，最小充值金额"
        :content-flex="false"
      >
        <XInputNumber
          v-model="form.minRechargeAmount"
          placeholder="最小充值金额"
          :min="0"
        />
      </FormField>
      <FormField
        label="最大充值金额"
        desc="用户充值时，最大充值金额"
        :content-flex="false"
      >
        <XInputNumber
          v-model="form.maxRechargeAmount"
          placeholder="最大充值金额"
          :min="0"
        />
      </FormField>

      <FormField
        label="最小积分券金额"
        desc="生成积分券时，最小充值金额"
        :content-flex="false"
      >
        <XInputNumber
          v-model="form.minVoucherAmount"
          placeholder="最小积分券金额"
          :min="0"
        />
      </FormField>
      <FormField
        label="最大积分券金额"
        desc="生成积分券时，最大充值金额"
        :content-flex="false"
      >
        <XInputNumber
          v-model="form.maxVoucherAmount"
          placeholder="最大积分券金额"
          :min="0"
        />
      </FormField>
  
      <FormField
        label="过滤词"
        variant="vertical"
        desc="排除图像识别经常出现的错误IMEI/SN"
      >
        <XTextarea
          v-model="form.excludedWords"
          placeholder="过滤词"
          rows="8"
        />
      </FormField>

      <FormField
        label="允许网页注册"
        desc="关闭后，将不允许用户通过网页注册"
        :content-flex="false"
      >
        <XSwitch v-model="form.enableRegister" />
      </FormField>
  
      <FormField
        label="允许订单验证"
        desc="关闭后，将不允许用户提交订单验证"
        :content-flex="false"
      >
        <XSwitch v-model="form.enableOrderVerify" />
      </FormField>
  
      <!-- <FormField
        label="允许提交工单"
        desc="关闭后，将不允许用户提交工单"
        :content-flex="false"
      >
        <XSwitch v-model="form.enableTricket" />
      </FormField> -->
      <FormField
        label="查询类-提交工单"
        desc="关闭后，将不允许查询类订单提交工单"
        :content-flex="false"
      >
        <XSwitch v-model="form.queryValidation" />
      </FormField>

      <FormField
        label="解锁类-提交工单"
        desc="关闭后，将不允许解锁类订单提交工单"
        :content-flex="false"
      >
        <XSwitch v-model="form.unlockValidation" />
      </FormField>

      <XFormField label="订单自动清理" desc="订单是否开启自动清理">
        <XSwitch class="ml-auto" v-model="form.autoCleanEnable" />
      </XFormField>

      <XFormField label="订单保留天数" desc="订单自动清理最大保留天数">
        <div class="ml-auto flex items-center gap-2">
          <XInput
            ui-root="w-20"
            v-model="form.orderRetainDays"
            @input="(e: Event) => form.orderRetainDays = handleInputChange(e)"
            @change="(e: Event) => form.orderRetainDays = handleInputChange(e)"
          />
          <span>天</span>
        </div>
      </XFormField>

      <XFormField label="积分记录自动清理" desc="积分记录开启自动清理">
        <XSwitch class="ml-auto" v-model="form.autoCreditCleanEnable" />
      </XFormField>

      <XFormField label="积分记录保留天数" desc="积分记录自动清理最大保留天数">
        <div class="ml-auto flex items-center gap-2">
          <XInput
            ui-root="w-20"
            v-model="form.creditsRetainDays"
            @input="(e: Event) => form.creditsRetainDays = handleInputChange(e)"
            @change="(e: Event) => form.creditsRetainDays = handleInputChange(e)"
          />
          <span>天</span>
        </div>
      </XFormField>
    </div>

    <div class="px-4 py-3 flex justify-end border-t">
      <XButton label="应用修改" :loading="loading" @click="handleSubmit" />
    </div>
  </div>
</template>

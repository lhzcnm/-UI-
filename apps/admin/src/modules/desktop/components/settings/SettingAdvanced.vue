<script setup lang="ts">
import type { Configs, Settings } from '@/inters/settings'
import { updateSetting, updateConfig } from '@/api/settings'
import { toast } from 'vue-sonner'

interface SettingPlaneProps {
  settings: Settings
  configs: Configs
}

const { settings, configs } =
  defineProps<SettingPlaneProps>()

const loading = ref(false)
const form = reactive({
  enableRegister: settings.enableRegister,
  enableOrderVerify: settings.enableOrderVerify,
  enableTricket: settings.enableTricket,
  minRechargeAmount: settings.minRechargeAmount,
  maxRechargeAmount: settings.maxRechargeAmount,
  invitePonit: +configs['invite:point'],
  inviteForPonit: +configs['invite:for:point'],
  excludedWords: configs['filter:excluded_words']
    ? JSON.parse(configs['filter:excluded_words']).join('|')
    : '',
  invite: settings.invite,
})

const iStore = useSystemStore()

function handleSubmit() {
  loading.value = true

  const response = Promise.all([
    updateSetting([
      { name: 'enableRegister', status: form.enableRegister },
      { name: 'enableOrderVerify', status: form.enableOrderVerify },
      { name: 'enableTricket', status: form.enableTricket },
      { name: 'minRechargeAmount', content: form.minRechargeAmount.toString() },
      { name: 'maxRechargeAmount', content: form.maxRechargeAmount.toString() },
      { name: 'invite', content: form.invite }
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
  ])

  response.then(() => {
    toast.success('修改成功')
    iStore.showSetting = false
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
  
      <FormField
        label="允许提交工单"
        desc="关闭后，将不允许用户提交工单"
        :content-flex="false"
      >
        <XSwitch v-model="form.enableTricket" />
      </FormField>
    </div>

    <div class="px-4 py-3 flex justify-end border-t">
      <XButton label="应用修改" :loading="loading" @click="handleSubmit" />
    </div>
  </div>
</template>

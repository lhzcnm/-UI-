<script setup lang="ts">
import type { Configs, Settings } from '@/inters/settings'
import { updateSetting, updateConfig, updateThread } from '@/api/settings'
import { toast } from 'vue-sonner'

interface TheProps {
  settings: Settings
  configs: Configs
}

const { settings, configs } = defineProps<TheProps>()

const loading = ref(false)
const form = reactive({
  enableRegister: settings.enableRegister,
  enableOrderVerify: settings.enableOrderVerify,
  // enableTricket: settings.enableTricket,
  queryValidation: settings.queryValidation,
  unlockValidation: settings.unlockValidation,
  minRechargeAmount: settings.minRechargeAmount,
  maxRechargeAmount: settings.maxRechargeAmount,
  minVoucherAmount: settings.minVoucherAmount ?? 0,
  maxVoucherAmount: settings.maxVoucherAmount ?? 0,
  invitePonit: +configs['invite:point'],
  inviteForPonit: +configs['invite:for:point'],
  excludedWords: configs['filter:excluded_words']
    ? JSON.parse(configs['filter:excluded_words']).join('|')
    : '',
  invite: settings.invite,
  threads: settings.threads ?? 5,
})

const iStore = useSystemStore()

function handleSubmit() {
  loading.value = true

  const response = Promise.all([
    updateSetting([
      { name: 'enableRegister', status: form.enableRegister },
      { name: 'enableOrderVerify', status: form.enableOrderVerify },
      // { name: 'enableTricket', status: form.enableTricket },
      { name: 'minRechargeAmount', content: form.minRechargeAmount.toString() },
      { name: 'maxRechargeAmount', content: form.maxRechargeAmount.toString() },
      { name: 'minVoucherAmount', content: form.minVoucherAmount.toString() },
      { name: 'maxVoucherAmount', content: form.maxVoucherAmount.toString() },
      { name: 'queryValidation', status: form.queryValidation },
      { name: 'unlockValidation', status: form.unlockValidation },
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
        ),
      },
    ]),
    updateThread(form.threads),
  ])

  response.then(() => {
    toast.success('修改成功')
    iStore.showSetting = !iStore.showSetting
  })

  response.finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="flex-1 divide-y pb-4 overflow-y-auto">
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
        label="最小充值金额"
        desc="最小充值金额"
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
        desc="最大充值金额"
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
        desc="最小积分券金额"
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
        desc="最大积分券金额"
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
    </div>

    <div class="pt-3 flex justify-end border-t">
      <XButton label="应用修改" :loading="loading" @click="handleSubmit" />
    </div>
  </div>
</template>

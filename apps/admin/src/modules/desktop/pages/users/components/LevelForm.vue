<script setup lang="ts">
import SelectLevelType from '@desktop/components/SelectLevelType.vue'

import type { LevelCreateParams } from '@/inters/level'
import { zLevelForm } from '@/inters/level'
import { handleInputNumberChange } from '@/utils'
import { PLAN_TYPE_ENUM } from '@/utils/enum'

const form = defineModel<LevelCreateParams>({ required: true })
const formRef = useTemplateRef('formRef')

defineExpose({
  validateForm: () => formRef.value!.validateForm(),
  clearErrors: () => formRef.value!.clearErrors(),
})
</script>

<template>
  <XForm ref="formRef" :model="form" :schema="zLevelForm">
    <XFormItem field="pricePlan" label="等级名称">
      <XInput v-model="form.pricePlan" placeholder="等级名称" />
    </XFormItem>

    <XFormItem field="pricePlanLocal" label="等级名称EN">
      <XInput v-model="form.pricePlanLocal" placeholder="等级名称EN" />
    </XFormItem>

    <XFormItem field="accessLevel" label="会员组权限">
      <SelectAccesslevel v-model="form.accessLevel" />
    </XFormItem>

    <XFormItem field="upgradeType" label="会员组类型">
      <SelectLevelType v-model="form.upgradeType" />
    </XFormItem>

    <XFormItem
      v-show="form.upgradeType === PLAN_TYPE_ENUM.GRANDTOTAL"
      field="thresholdAmount"
      label="升级到该会员所需充值金额"
    >
      <XInput
        v-model="form.thresholdAmount" placeholder="累计充值"
        @input="(e: Event) => form.thresholdAmount = handleInputNumberChange(e, 0)!"
        @change="(e: Event) => form.thresholdAmount = handleInputNumberChange(e, 0)!"
      />
    </XFormItem>

    <XFormItem label="允许访问隐藏服务">
      <XSwitch v-model="form.showHiddenService" />
    </XFormItem>

    <XFormItem label="允许访问设备页面">
      <XSwitch v-model="form.enableDevice" />
    </XFormItem>

    <XFormItem label="禁用">
      <XSwitch v-model="form.disablePricePlan" />
    </XFormItem>
  </XForm>
</template>

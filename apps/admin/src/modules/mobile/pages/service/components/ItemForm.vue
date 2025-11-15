<script setup lang="ts">
import type { ServiceCreateParams } from '@/inters/services'
import { IMEI_TYPE } from '@3un/utils'
import { XRadio, XSwitch } from '@3un/ui'

interface ItemFormProps {
  isCreate: boolean
  resetPrice: () => void
}

const props = defineProps<ItemFormProps>()
const form = defineModel<ServiceCreateParams>({ required: true })
const store = useServiceStore()
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <FormField label="所在服务组" desc="选择要添加到的服务组">
      <XNativeSelect
        v-model="form.categoryId"
        placeholder="请选择服务组"
        :options="store.groups"
        value-key="categoryId"
        label-key="category"
      />
    </FormField>

    <FormField label="服务简写" desc="用于桌面端程序" required>
      <XInput v-model="form.tmpTitle" placeholder="服务简写" />
    </FormField>

    <FormField label="服务名称" desc="服务中文名称" required>
      <XInput v-model="form.packageTitle" placeholder="服务中文名称" />
    </FormField>

    <FormField label="服务名称(EN)" desc="服务英文名称" required>
      <XInput v-model="form.packageTitleLocal" placeholder="服务英文名称" />
    </FormField>

    <FormField label="服务价格" desc="最低 0.01" required>
      <XInputNumber
        v-model.number="form.packagePrice"
        :step="0.01" :min="0.01" :precision="2"
      />
    </FormField>

    <FormField label="处理时间" desc="服务预计处理时间" required>
      <XInput v-model="form.timeTaken" placeholder="处理时间" />
    </FormField>
    
    <FormField label="处理时间(EN)" desc="服务预计处理时间" required>
      <XInput v-model="form.timeTakenLocal" placeholder="处理时间EN" />
    </FormField>

    <FormField label="商品服务价格" desc="商城服务价格">
      <XInputNumber
        v-model.number="form.storePrice"
        :step="0.01" :min="0.01" :precision="2"
      />
    </FormField>

    <FormField label="排序" desc="值越大越靠前">
      <XInputNumber v-model.number="form.packageOrderBy" :step="1" />
    </FormField>

    <FormField
      label="提交类型"
      desc="用户提交订单时，限制提交的数据类型"
      variant="vertical"
    >
      <div class="flex space-x-4">
        <XRadio
          v-model="form.imeiFieldType"
          :value="IMEI_TYPE.NONE"
          name="imeiType" label="不限制"
        />
        <XRadio
          v-model="form.imeiFieldType"
          name="imeiType"
          :value="IMEI_TYPE.IMEI"
          label="IMEI"
        />
        <XRadio
          v-model="form.imeiFieldType"
          :value="IMEI_TYPE.SN"
          name="imeiType" label="SN"
        />
        <XRadio
          v-model="form.imeiFieldType"
          :value="IMEI_TYPE.IMEI_OR_SN"
          name="imeiType" label="IMEI OR SN"
        />
      </div>
    </FormField>

    <FormField
      v-if="!props.isCreate"
      label="重置价格"
      desc="所有用户恢复原价"
      :content-flex="false"
    >
      <XButton
        label="重置"
        color="danger"
        icon="lucide:database-backup"
        @click="props.resetPrice"
      />
    </FormField>

    <FormField
      label="禁止重复提交"
      desc="不允许重复的 IMEI 提交"
      :content-flex="false"
    >
      <XSwitch v-model="form.duplicateImeiNotAllowed" />
    </FormField>

    <FormField
      label="公众号推送消息"
      desc="如果开启，公众号将推送订单结果给用户"
      :content-flex="false"
    >
      <XSwitch v-model="form.pushMsg" />
    </FormField>

    <FormField
      label="解锁服务"
      desc="该服务是否为解锁服务"
      :content-flex="false"
    >
      <XSwitch v-model="form.isUnlock" />
    </FormField>

    <FormField
      label="推荐服务"
      desc="如果开启，将在订单结果下面显示"
      :content-flex="false"
    >
      <XSwitch v-model="form.testimonials" />
    </FormField>

    <FormField
      :content-flex="false"
      label="首页推荐"
      desc="如果开启，将在首页显示"
    >
      <XSwitch v-model="form.isHot" />
    </FormField>

    <FormField
      label="新服务推荐"
      desc="如果开启，将显示新服务标记"
      :content-flex="false"
    >
      <XSwitch v-model="form.isNew" />
    </FormField>

    <FormField
      label="禁用服务"
      desc="禁用后，用户看不到也不能提交订单"
      :content-flex="false"
    >
      <XSwitch v-model="form.disablePackage" />
    </FormField>
  </form>
</template>

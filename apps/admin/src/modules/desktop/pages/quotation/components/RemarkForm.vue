<script setup lang="ts">
import type { ApiEnum } from '@/inters/quotation'
import type { RemarkCreate } from '@/inters/quotation/remark'
import SelectApiEnum from './SelectApiEnum.vue';
import SelectCategory from './SelectCategory.vue';

interface HqbFormProps {
  brands: ApiEnum[],
}

defineProps<HqbFormProps>()

const form = defineModel<RemarkCreate>({ required: true })
</script>

<template>
  <form class="divide-y p-4" @submit.prevent>
    <FormField label="品牌" desc="设备品牌">
      <SelectApiEnum class="min-w-52" :api-enums="brands" v-model="form.brand" />
    </FormField>
    <FormField label="设备型号" desc="设备型号">
      <XInput ui-root="min-w-52" placeholder="设备型号" v-model="form.model" />
    </FormField>
    <FormField label="报价单" desc="所属报价单">
      <SelectCategory v-model="form.priceType" />
    </FormField>
    <FormField label="备注信息" desc="中文备注内容" variant="vertical">
      <XTextarea rows="6" v-model="form.remark" />
    </FormField>
    <FormField label="备注信息" desc="英文备注内容" variant="vertical">
      <XTextarea rows="6" v-model="form.remarkLocal" />
    </FormField>
  </form>
</template>

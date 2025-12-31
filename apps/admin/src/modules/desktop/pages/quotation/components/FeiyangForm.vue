<script setup lang="ts">
import type { ApiEnum } from '@/inters/quotation'
import { type FeiyangCreateForm } from '@/inters/quotation/feiyang'

interface FeiyangFormProps {
  appearances: ApiEnum[],
}

defineProps<FeiyangFormProps>()

const form = defineModel<FeiyangCreateForm>({ required: true })
</script>

<template>
  <form class="divide-y p-4" @submit.prevent>
    <FormField label="设备型号" desc="设备型号">
      <XInput placeholder="设备型号" v-model="form.model" />
    </FormField>
    <FormField label="设备容量" desc="设备容量">
      <XInput placeholder="设备容量" v-model="form.memory" />
    </FormField>
    <FormField label="设备价格" desc="设备价格">
      <XInputNumber v-model="form.price" />
    </FormField>
    <FormField label="设备状态" desc="设备状态">
      <!-- <XInput placeholder="设备状态" v-model="form.appearanceDesc" /> -->
      <XSelect
        v-model="form.appearanceDesc">
        <XSelectItem
          v-for="appearance in appearances" :key="appearance.code"
          :value="appearance.descCn" :label="appearance.descCn"
        />
      </XSelect>
    </FormField>
  </form>
</template>

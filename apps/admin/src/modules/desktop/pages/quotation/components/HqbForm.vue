<script setup lang="ts">
import type { ApiEnum } from '@/inters/quotation'
import type { HqbCreateForm } from '@/inters/quotation/hqb'

interface HqbFormProps {
  statuses: ApiEnum[],
  colors: ApiEnum[],
}

defineProps<HqbFormProps>()

const form = defineModel<HqbCreateForm>({ required: true })
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
        v-model="form.statusDesc">
        <XSelectItem
          v-for="status in statuses" :key="status.code"
          :value="status.descCn" :label="status.descCn"
        />
      </XSelect>
    </FormField>
    <FormField label="颜色" desc="设备颜色">
      <!-- <XInput placeholder="设备状态" v-model="form.appearanceDesc" /> -->
      <XSelect
        v-model="form.colorDesc">
        <XSelectItem
          v-for="color in colors" :key="color.code"
          :value="color.descCn" :label="color.descCn"
        />
      </XSelect>
    </FormField>
  </form>
</template>

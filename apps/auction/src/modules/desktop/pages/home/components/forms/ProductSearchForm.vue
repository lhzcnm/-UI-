<script setup lang="ts">
import SelectCapacity from '@desktop/components/SelectCapacity.vue'
import SelectColor from '@desktop/components/SelectColor.vue'
import SelectLockStatus from '@desktop/components/SelectLockStatus.vue'
import SelectModel from '@desktop/components/SelectModel.vue'
import SelectGrade from '@desktop/components/SelectGrade.vue'

import { type ProductSearch } from '@/inters/product'

const form = defineModel<ProductSearch>({ required: true })
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <XFormField label="型号" desc="设备型号">
      <SelectModel v-model="form.model" />
    </XFormField>
    <XFormField label="颜色" desc="设备颜色">
      <SelectColor v-model="form.colorName" />
    </XFormField>
    <XFormField label="内存" desc="设备内存">
      <SelectCapacity v-model="form.capacity" />
    </XFormField>
    <XFormField label="等级" desc="设备成色等级">
      <!-- <SelectCapacity v-model="form.grade" /> -->
      <SelectGrade v-model="form.grade" />
    </XFormField>
    <XFormField label="锁状态" desc="设备锁状态">
      <SelectLockStatus v-model="form.lockStatus" />
    </XFormField>
  </form>
</template>

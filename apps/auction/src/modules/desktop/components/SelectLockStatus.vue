<script setup lang="ts">
import { XSelect } from '@3un/ui'

const { locks } = useInfrastructure()

const model = defineModel<string>({ required: true })
</script>

<template>
  <XSelect v-model="model"
    clearable
    placeholder="请选择产品锁状态"
    @clear="model = ''">
    <template v-for="status in locks" :key="status">
      <XSelectItem :value="status" :label="status"  />
    </template>
  </XSelect>
</template>

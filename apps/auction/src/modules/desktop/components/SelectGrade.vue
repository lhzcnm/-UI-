<script setup lang="ts">
import { XSelect, XSelectItem } from '@3un/ui'

const { grades } = useInfrastructure()

const model = defineModel<string>({ required: true })
</script>

<template>
  <XSelect v-model="model"
    clearable
    placeholder="请选择产品成色"
    @clear="model = ''">
    <template v-for="grade in grades" :key="grade">
      <XSelectItem :value="grade"
        :label="grade" />
    </template>
  </XSelect>
</template>

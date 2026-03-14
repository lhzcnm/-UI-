<script setup lang="ts">
import { XSelect, XSelectItem } from '@3un/ui'

const { colors } = useInfrastructure()

const model = defineModel<string>({ required: true })

const input = ref<string>('')

const displayData = computed(() => colors.filter(c => c.toLowerCase().includes(input.value.toLowerCase())))
</script>

<template>
  <XSelect v-model="model"
    v-model:input="input"
    clearable
    filterable
    placeholder="请选择产品颜色"
    @clear="model = ''">
    <template v-for="color in displayData" :key="color">
      <XSelectItem :value="color"
        :label="color" />
    </template>
  </XSelect>
</template>

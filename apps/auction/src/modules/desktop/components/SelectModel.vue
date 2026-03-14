<script setup lang="ts">
import { XSelect, XSelectItem } from '@3un/ui'

const { models } = useInfrastructure()

const model = defineModel<string>({ required: true })

const input = ref<string>('')

const displayData = computed(() => models.filter(m => m.toLowerCase().includes(input.value.toLowerCase())))
</script>

<template>
  <XSelect v-model="model"
    v-model:input="input"
    filterable
    clearable
    placeholder="请选择产品型号"
    @clear="model = ''">
    <template v-for="model in displayData" :key="model">
      <XSelectItem :value="model"
        :label="model" />
    </template>
  </XSelect>
</template>

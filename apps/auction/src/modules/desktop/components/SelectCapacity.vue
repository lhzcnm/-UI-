<script setup lang="ts">
import { XSelect, XSelectItem } from '@3un/ui'

const { capacities } = useInfrastructure()

const model = defineModel<string>({ required: true })

const input = ref<string>('')

const displayData = computed(() => capacities.filter(c => c.toLowerCase().includes(input.value.toLowerCase())))
</script>

<template>
  <XSelect v-model="model"
    v-model:input="input"
    clearable
    filterable
    placeholder="请选择产品容量"
    @clear="model = ''">
    <template v-for="capacity in displayData" :key="capacity">
      <XSelectItem :value="capacity"
        :label="capacity" />
    </template>
  </XSelect>
</template>

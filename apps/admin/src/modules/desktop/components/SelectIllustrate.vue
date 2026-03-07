<script setup lang="ts">
import { type XSelectEmits } from '@3un/ui'

const iStore = useSystemStore()

const code = defineModel<string>({ required: true })

const emits = defineEmits<XSelectEmits>()

const input = ref<string>('')
</script>

<template>
  <XSelect v-model="code"
    v-model:input="input"
    filterable
    placement="bottom-start"
    placeholder="请选择说明文档"
    @selected="emits('selected', $event)">
    <XSelectItem v-for="[key, _] in iStore.illustrates" :key="key"
      :value="key" :label="key" />
  </XSelect>
</template>

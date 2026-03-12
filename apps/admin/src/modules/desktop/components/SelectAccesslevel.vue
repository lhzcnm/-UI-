<script setup lang="ts">
import { ACCESS_LEVEL, ACCESS_LEVEL_LIST } from '@3un/utils'

const accessLevel = defineModel<ACCESS_LEVEL>({ required: true })
</script>

<template>
  <XSelect
    v-model="accessLevel"
  >
    <template v-for="level in ACCESS_LEVEL_LIST" :key="level.value">
      <XSelectItem :value="level.value" :label="level.label" />
    </template>
  </XSelect>
</template>

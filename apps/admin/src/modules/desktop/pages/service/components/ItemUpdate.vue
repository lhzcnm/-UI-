<script setup lang="ts">
import { SERVICE_STORE } from '../utils'
import ItemForm from './ItemForm.vue'

const store = inject(SERVICE_STORE)!
</script>

<template>
  <XDialog v-model="store.visableUpdate">
    <ItemForm v-model="store.updateForm" />
  </XDialog>
</template>

<script setup lang="ts">
import type { LabelCreateForm } from '@/types'
import { XFormField } from '@3un/ui'

const form = defineModel<LabelCreateForm>({ required: true })
const localStore = useLocalStore()
</script>

<template>
  <form class="divide-y">
    <XFormField :label="localStore.localData['print_LabelNameForm']" :desc="localStore.localData['print_DescModel']">
      <XInput v-model="form.label" :placeholder="localStore.localData['print_EnterLabelname']" />
    </XFormField>
    <XFormField :label="localStore.localData['print_LabelContentForm']" :desc="localStore.localData['print_DescLableContent']">
      <XInput v-model="form.value" :placeholder="localStore.localData['print_EnterLableContent']" />
    </XFormField>
  </form>
</template>
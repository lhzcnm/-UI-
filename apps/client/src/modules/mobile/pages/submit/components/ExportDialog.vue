<script setup lang="ts">
interface modeEmits {
  updateMode: [mode: number]
}
const emits = defineEmits<modeEmits>()
const mode = ref('')
const { t } = useI18n()

</script>

<template>
  <div class="space-y-4 p-2">
    <label class="block text-sm text-center w-full font-medium text-gray-700 dark:text-gray-400">
      {{ t('query.mixedDataWarning') }}
    </label>

    <div class="flex space-x-2 justify-evenly">
      <XRadio v-model="mode" name="transferType" :label="t('query.showAll')" value="2" />
      <XRadio v-model="mode" name="transferType" label="IMEI" value="0" />
      <XRadio v-model="mode" name="transferType" label="SN" value="1" />
    </div>
  </div>

  <div class="border-t p-2">
    <XButton @click="emits('updateMode', Number(mode))" :label="t('button.import')" size="sm" variant="soft" class="w-full" />
  </div>

</template>
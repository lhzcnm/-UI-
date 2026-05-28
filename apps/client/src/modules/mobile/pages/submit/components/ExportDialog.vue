<script setup lang="ts">
interface modeEmits {
  updateMode: [mode: number]
}
const emits = defineEmits<modeEmits>()
const mode = ref('')


</script>

<template>
  <div class="space-y-4 p-2">
    <label class="block text-sm text-center w-full font-medium text-gray-700 dark:text-gray-400">
      检测到混合数据，请选择需要导入的数据
    </label>

    <div class="flex space-x-2 justify-evenly">
      <XRadio v-model="mode" name="transferType" label="全部" value="2" />
      <XRadio v-model="mode" name="transferType" label="IMEI" value="0" />
      <XRadio v-model="mode" name="transferType" label="SN" value="1" />
    </div>
  </div>

  <div class="border-t p-2">
    <XButton @click="emits('updateMode', Number(mode))" label="确认导入" size="sm" variant="soft" class="w-full" />
  </div>

</template>
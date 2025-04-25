<script setup lang="ts">
interface ServiceDescriptionProps {
  mustRead: string | null
}

defineProps<ServiceDescriptionProps>()
const visible = defineModel<boolean>({ required: true })
</script>

<template>
  <XDialog
    v-model="visible" :text="mustRead || ''"
    title="服务说明" :close-btn="false"
  >
    <template #footer>
      <div class="flex justify-end mt-3">
        <XButton
          label="朕已知晓" color="warning"
          @click="visible = false"
        />
      </div>
    </template>
  </XDialog>
</template>

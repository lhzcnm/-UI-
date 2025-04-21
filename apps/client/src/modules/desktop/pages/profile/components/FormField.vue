<script setup lang="ts">
interface FormFieldProps {
  type?: 'text' | 'password'
  label: string
  value: string
  actionText: string
  onAction: () => void
}

defineProps<FormFieldProps>()
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-sm text-muted-foreground">{{ label }}</span>
      <a
        href="javascript:void(0)"
        class="text-sm text-primary hover:underline"
        @click="onAction"
      >
        {{ actionText }}
      </a>
    </div>

    <input
      :value="value" :type="type" readonly
      class="w-full h-9 px-2.5 text-sm border rounded-md outline-none bg-muted/80"
    />
  </div>
</template>

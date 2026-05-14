<script setup lang="ts">
import type { PrintHeader } from '@/types'
import { useCopyFn } from '@3un/utils';

interface SelectHeaderProps {
  headers: PrintHeader[],
}

const { headers } = defineProps<SelectHeaderProps>()

const modelKeys = defineModel<string[]>('keys', { required: true, default: [] })
const visible = defineModel<boolean>({ required: true, default: false })

const { locale } = useI18n()

const selKeys = ref<string[]>([])

const curHeaderKeys = useCopyFn(() => modelKeys.value)

watch(
  () => visible.value,
  () => {
    selKeys.value = curHeaderKeys()
  }
)

const isEn = computed(() => locale.value === 'en')

function handleClose() {
  visible.value = false
}

function handleConfirm() {
  modelKeys.value = selKeys.value
  handleClose()
}
</script>

<template>
  <XDialog v-model="visible" title="二维码显示内容">
    <template #default>
      <div class="flex items-center gap-4 flex-wrap">
        <label class="flex gap-2 items-center" v-for="header in headers" :key="header.key">
          <input type="checkbox" name="" id="" :checked="selKeys.includes(header.key)" :value="header.key"
            v-model="selKeys">
          <span>{{ isEn ? header.nameEn : header.name }}</span>
        </label>
      </div>
    </template>

    <template #footer>
      <div class="mt-2 flex items-center gap-2 justify-end">
        <XButton variant="soft" @click="handleClose">取消</XButton>
        <XButton @click="handleConfirm">确认</XButton>
      </div>
    </template>
  </XDialog>
</template>

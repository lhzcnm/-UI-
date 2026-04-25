<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { type QuotationUpload } from '@/inters/quotation'
import { QUOTATION_ENUM_LIST } from '@/utils/enum'

const form = defineModel<QuotationUpload>({ required: true })

const fileSelectRef = ref<HTMLInputElement | null>(null)

const filename = computed(() => {
  return form.value.file?.name ?? "选择报价单文件"
})

function handleClick() {
  fileSelectRef.value?.click()
}

function handleChange(e: Event) {
  if(!fileSelectRef.value) return
  const input = e.target as HTMLInputElement

  if (!input.files || input.files.length === 0) {
    return
  }

  form.value.file = input.files[0]
  fileSelectRef.value.value = ""
}
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <XFormField label="报价单类型" desc="报价单类型">
      <XSelect
        v-model="form.key"
      >
        <XSelectItem
          v-for="item in QUOTATION_ENUM_LIST" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
    </XFormField>

    <XFormField label="报价单图片" desc="上传报价单图片">
      <button class="w-full flex items-center border rounded-lg px-3 py-2 gap-2" @click="handleClick">
        <Icon icon="lucide:upload" />
        <span>{{ filename }}</span>
      </button>
    </XFormField>

    <input ref="fileSelectRef" class="hidden" type="file" accept="image/*"  @change="handleChange">
  </form>
</template>

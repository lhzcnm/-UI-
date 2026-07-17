<script setup lang="ts">
import type { XBtnSplitOptions } from '@3un/ui'
import { DOCX_STORE } from '../utils'
import { zIllustrateForm, type IllustrateItem } from '@/inters/illustrate'
import { xconfirm } from '@3un/utils';
import { DeleteIllustrate } from '@/api/illustrate';
import { toast } from 'vue-sonner';

interface IllustrateActionProps {
  row: IllustrateItem,
  index: number
}

const props = defineProps<IllustrateActionProps>()

const store = inject(DOCX_STORE)!

const btnOptions: XBtnSplitOptions = [
  { label: '图片预览', command: openImagePreview },
  { label: '删除', command: handleDeleteClick }
]

function openImagePreview() {
  store.index = props.index
  store.visibleImage = true
}

async function handleDeleteClick() {
  if (!await xconfirm('是否确认删除该数据')) return

  await DeleteIllustrate([props.row.serviceCode])
  toast.success('删除成功')
  store.refresh = !store.refresh
}

function openEdit() {
  const { index, row } = props
  store.formBase = zIllustrateForm.parse({
    ...row,
    description: row.description ?? '',
    images: []
  })
  store.index = index
  store.visibleBase = true
}
</script>

<template>
  <XButtonSplit
    :options="btnOptions"
    label="编辑"
    size="sm"
    @click="openEdit"
  />
</template>

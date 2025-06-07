<script setup lang="ts">
import { ORDER_STATUS_LIST } from '@3un/utils'
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'

import type { OrderBatchEditItem } from '@/inters/orders'
import { STORE } from '../utils'

const store = inject(STORE)!

const importDecorator = (fn: (...args: any[]) => void) => {
  return (...args: any[]) => {
    if (!store.serviceId) {
      toast.warning('请先选择服务')
      return
    }

    if (!store.status) {
      toast.warning('请先选择订单状态')
      return
    }

    fn(...args)
  }
}

async function handleDrop(event: DragEvent) {
  const file = event.dataTransfer!.files[0]
  const extension = file.name.split('.').pop()!.toLowerCase()

  if (extension !== 'txt') {
    toast.warning('仅支持 txt 文件')
    return
  }

  handleText(await file.text())
}

async function handlePaste(event: ClipboardEvent) {
  const text = event.clipboardData!.getData('text/plain')
  handleText(text)
}

function handleFile() {
  const fileInput = document.createElement('input')

  fileInput.type = 'file'
  fileInput.accept = 'text/plain'
  fileInput.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files![0]
    const extension = file.name.split('.').pop()!.toLowerCase()

    if (extension !== 'txt') 
      return toast.warning('仅支持 txt 文件')
    
    handleText(await file.text())
  }

  fileInput.click()
}

const onDrop = importDecorator(handleDrop)
const onPaste = importDecorator(handlePaste)
const onFile = importDecorator(handleFile)

function handleText(text: string) {
  const lines = text.split('\n')
  store.items = lines.map((line) => {
    const [imei, ...value] = line.trim().split(/\s+/)
    if (!imei || !value.length) return null

    let code, serverOrderId
    if (store.isCode) {
      code = value.join(' ').split('<br>').join('\n')
      serverOrderId = null
    }
    else {
      code = null
      serverOrderId = value.join(' ')
    }

    return {
      code,
      serverOrderId,
      serviceId: store.serviceId!,
      originalStatus: store.status!,
      status: store.status!,
      imei: imei.trim(),
      codeId: undefined,
    }
  }).filter(Boolean) as OrderBatchEditItem[]
}
</script>

<template>
  <section class="px-6 pb-6 flex-1">
    <div class="flex items-center space-x-2">
      <div>
        <label class="block mb-1 text-label text-sm">修改类型：</label>
        <XSelect
          v-model="store.isCode"
          placeholder="请选择修改内容"
          ui-trigger="w-48"
        >
          <XSelectItem :value="true" label="订单结果" />
          <XSelectItem :value="false" label="上游订单号" />
        </XSelect>
      </div>

      <div>
        <label class="block mb-1 text-label text-sm">服务：</label>
        <SelectService v-model="store.serviceId" ui-trigger="w-64" />
      </div>

      <div>
        <label class="block mb-1 text-label text-sm">订单状态：</label>
        <XSelect
          v-model="store.status"
          placeholder="请选择订单状态"
          ui-trigger="w-48"
        >
          <XSelectItem
            v-for="item in ORDER_STATUS_LIST" :key="item.value"
            :value="item.value" :label="item.label"
          />
        </XSelect>
      </div>
    </div>

    <div
      :class="twJoin(
        'flex flex-col items-center justify-center mt-3 space-y-3',
        'text-muted-foreground border border-dashed rounded-md h-80',
      )"

      @dragover.prevent
      @drop.prevent="onDrop"
      @paste.prevent="onPaste"
    >
      <Icon icon="iconoir:multiple-pages" class="size-10" />
      <span class="text-center">将 TXT 文件拖拽/粘贴到此处<br>或者直接粘贴文本</span>
      <XButton label="选择文件" @click="onFile" />
    </div>
  </section>
</template>

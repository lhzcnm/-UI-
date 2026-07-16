<script setup lang="ts">
import ImageDialog from './component/ImageDialog.vue'
import { DOCX_STORE, type DocxStore } from './utils'
import { columns } from './utils/column'

const store = reactive<DocxStore>({
  docxImageMap: new Map(),

  visibleImage: false,

  index: undefined
})

provide(DOCX_STORE, store)

const iStore = useSystemStore()

await iStore.getIllustrateList()
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <!-- <XButton label="" /> -->
      <XButton label="删除说明文档" color="danger" icon="lucide:trash-2" />
    </section>

    <div class="p-3 pb-0">
      <XTable
        ref="tableRef"
        :columns="columns"
        :data="iStore.illustrateList"
        class="border h-[calc(100vh-8.75rem)]"
      />
    </div>

    <ImageDialog />
  </div>
</template>

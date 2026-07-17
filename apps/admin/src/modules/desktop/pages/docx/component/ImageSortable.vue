<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { Icon } from '@iconify/vue'

import { type IllustrateImageItem } from '@/inters/illustrate'

interface ImageSortableEmits {
  add: []
}

const imageLinks = defineModel<IllustrateImageItem[]>({
  required: true
})

const emit = defineEmits<ImageSortableEmits>()

function handleDelete(index: number) {
  imageLinks.value.splice(index, 1)
}

function handleAdd() {
  emit('add')
}
</script>


<template>
  <div class="grid grid-cols-2 gap-3">
    <VueDraggable
      v-model="imageLinks"
      class="contents"
      item-key="id"
      :animation="200"
      ghost-class="drag-ghost"
      chosen-class="drag-chosen"
    >
      <div
        v-for="(item,index) in imageLinks"
        :key="item.id"
        class="relative cursor-move aspect-square rounded-xl border border-border"
      >
        <img
          :src="item.imageUrl"
          draggable="false"
          class="w-full h-fll object-cover block"
        />

        <button
          class="
            flex items-center justify-center
            absolute top-2 right-2 w-7 h-7 border-none rounded-[50%]
            bg-zinc-900/50  cursor-pointer hover:bg-zinc-800
          "
          type="button"
          @click.stop="handleDelete(index)"
        >
          <Icon icon="lucide:x" class="size-6" />
        </button>
      </div>
    </VueDraggable>

    <!-- 新增按钮 -->
    <button
      class="
        flex flex-col items-center justify-center bg-transparent border border-border cursor-pointer
        rounded-xl aspect-square gap-y-2
      "
      type="button"
      @click="handleAdd"
    >
      <Icon icon="lucide:file-plus-corner" class="size-12" />
      <label class="text-2xl">
        新增图片
      </label>
    </button>
  </div>
</template>

<style scoped>
/**
 * 拖动效果
 */
.drag-ghost {
  opacity: .3;
}

.drag-chosen {
  transform: scale(1.05);
}
</style>

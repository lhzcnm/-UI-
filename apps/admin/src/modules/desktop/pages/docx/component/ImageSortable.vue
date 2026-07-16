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

async function handleSort() {
  imageLinks.value.forEach((item, index) => {
    item.sort = index + 1
  })
  await nextTick()
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
      @end="handleSort"
    >
      <div
        v-for="(item,index) in imageLinks"
        :key="item.id"
        class="relative cursor-move aspect-square rounded-xl"
      >
        <img
          :src="item.imageUrl"
          draggable="false"
          class="w-full h-fll object-cover block"
        />

        <button
          class="delete-button"
          type="button"
          @click.stop="handleDelete(index)"
        >
          ×
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
 * 删除
 */
.delete-button {
  position:absolute;
  top:6px;
  right:6px;
  width:28px;
  height:28px;
  border:none;
  border-radius:50%;
  background:rgba(0,0,0,.55);
  color:#fff;
  font-size:20px;
  cursor:pointer;
}

.delete-button:hover {
  background:#ef4444;
}

/**
 * 拖动效果
 */
.drag-ghost {
  opacity:.3;
}

.drag-chosen {
  transform:scale(1.05);
}
</style>

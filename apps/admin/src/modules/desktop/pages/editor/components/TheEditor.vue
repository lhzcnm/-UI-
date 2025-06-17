<script setup lang="ts">
import { EditorContent } from '@tiptap/vue-3'


import { Icon } from '@iconify/vue'
import { XPopover } from '@3un/ui'

interface TheEditorProps {
  editor: any
}

const props = defineProps<TheEditorProps>()

const openHeading = ref(false)
const openFontSize = ref(false)
const openColor = ref(false)

const headingList = [
  // { label: '一级标题', value: 1 },
  { label: '二级标题', value: 2 },
  { label: '三级标题', value: 3 },
  { label: '四级标题', value: 4 },
]
const fontSizeList = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px(默认)', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '20px', value: '20px' },
  { label: '22px', value: '22px' },
  { label: '24px', value: '24px' },
  { label: '28px', value: '28px' },
]

function handleFontSize(event: Event) {
  const target = event.target as HTMLButtonElement
  const element = target.closest('[data-value]')!
  const fontSize = element.getAttribute('data-value')!

  props.editor!.chain().focus()
    .setMark('textStyle', {fontSize}).run()
}

function handleHeading(event: Event) {
  const target = event.target as HTMLButtonElement
  const element = target.closest('[data-value]')!
  const heading = element.getAttribute('data-value')!

  props.editor!.chain().focus()
    .toggleHeading({level: Number(heading) as any}).run()
}
</script>

<template>
  <div class="border rounded">
    <div class="flex items-center flex-wrap p-2 border-b">
      <div class="space-x-1">
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          @click="editor?.chain().focus().undo().run()"
        >
          <Icon icon="lucide:undo" class="size-5" />
          <div class="x-tooltip-text bottom120">撤销</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          @click="editor?.chain().focus().redo().run()"
        >
          <Icon icon="lucide:redo" class="size-5" />
          <div class="x-tooltip-text bottom120">重做</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-3 bg-border" />

      <XPopover
        v-model="openHeading"
        closeOnClickOutside
        trigger="click"
      >
        <template #trigger>
          <button class="x-tooltip hover:bg-muted rounded px-1.5 py-1">
            <Icon icon="lucide:heading" class="size-5" />
            <div class="x-tooltip-text bottom120">标题</div>
          </button>
        </template>

        <div class="w-28 p-1" @click="handleHeading">
          <button
            v-for="item in headingList" :key="item.value"
            :data-value="item.value"
            :class="[
              'flex items-center w-full text-sm',
              'rounded px-2 py-1 hover:bg-muted transition-colors',
              editor?.isActive('heading', {level: item.value})
            ]"
          >
            <span>{{ item.label }}</span>
            <Icon 
              icon="lucide:check" class="inline-block size-4 ml-auto opacity-0 transition-opacity"
              :class="{'opacity-100': editor?.isActive('heading', {level: item.value})}"
            />
          </button>
        </div>
      </XPopover>

      <hr class="h-5 w-px mx-3 bg-border" />

      <div class="space-x-1">
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive('bold')}"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <Icon icon="lucide:bold" class="size-5" />
          <div class="x-tooltip-text bottom120">加粗</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive('italic')}"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <Icon icon="lucide:italic" class="size-5" />
          <div class="x-tooltip-text bottom120">斜体</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive('underline')}"
          @click="editor?.chain().focus().toggleUnderline().run()"
        >
          <Icon icon="lucide:underline" class="size-5" />
          <div class="x-tooltip-text bottom120">下划线</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive('strike')}"
          @click="editor?.chain().focus().toggleStrike().run()"
        >
          <Icon icon="lucide:strikethrough" class="size-5" />
          <div class="x-tooltip-text bottom120">删除线</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-3 bg-border" />

      <div class="space-x-1">
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive('bulletList')}"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <Icon icon="lucide:list" class="size-5" />
          <div class="x-tooltip-text bottom120">无序列表</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive('orderedList')}"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <Icon icon="lucide:list-ordered" class="size-5" />
          <div class="x-tooltip-text bottom120">有序列表</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-3 bg-border" />

      <div class="space-x-1">
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive({ textAlign: 'left' })}"
          @click="editor?.chain().focus().setTextAlign('left').run()"
        >
          <Icon icon="lucide:align-left" class="size-5" />
          <div class="x-tooltip-text bottom120">左对齐</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive({ textAlign: 'center' })}"
          @click="editor?.chain().focus().setTextAlign('center').run()"
        >
          <Icon icon="lucide:align-center" class="size-5" />
          <div class="x-tooltip-text bottom120">居中对齐</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded px-1.5 py-1"
          :class="{'bg-muted': editor?.isActive({ textAlign: 'right' })}"
          @click="editor?.chain().focus().setTextAlign('right').run()"
        >
          <Icon icon="lucide:align-right" class="size-5" />
          <div class="x-tooltip-text bottom120">右对齐</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-3 bg-border" />

      <div class="space-x-1">
        <XPopover
          v-model="openFontSize"
          closeOnClickOutside
          trigger="click"
        >
          <template #trigger>
            <button class="x-tooltip hover:bg-muted rounded px-1.5 py-1">
              <Icon icon="iconoir:text-size" class="size-5" />
              <div class="x-tooltip-text bottom120">字号</div>
            </button>
          </template>
  
          <div class="w-32 p-1" @click="handleFontSize">
            <button
              v-for="item in fontSizeList" :key="item.value"
              :data-value="item.value"
              :class="[
                'flex items-center w-full text-sm',
                'rounded px-2 py-1 hover:bg-muted transition-colors',
              ]"
            >
              {{ item.label }}
            </button>
          </div>
        </XPopover>
  
        <XPopover
          v-model="openColor"
          closeOnClickOutside
          trigger="click"
        >
          <template #trigger>
            <button class="x-tooltip hover:bg-muted rounded px-1.5 py-1">
              <Icon icon="iconoir:color-picker" class="size-5" />
              <div class="x-tooltip-text bottom120">字体颜色</div>
            </button>
          </template>
  
          <div class="w-32 p-1" @click="handleFontSize">
            <button
              v-for="item in headingList" :key="item.value"
              :data-value="item.value"
              :class="[
                'flex items-center w-full text-sm',
                'rounded px-2 py-1 hover:bg-muted transition-colors',
              ]"
            >
              {{ item.label }}
            </button>
          </div>
        </XPopover>
      </div>
    </div>

    <EditorContent :editor="editor" class="p-2" />  
  </div>
</template>

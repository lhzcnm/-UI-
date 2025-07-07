<script setup lang="ts">
import HeadingPicker from './HeadingPicker.vue'
import FontSizePicker from './FontSizePicker.vue'
import TextColorPicker from './TextColorPicker.vue'

import { EditorContent, Editor } from '@tiptap/vue-3'
import { Icon } from '@iconify/vue'

import StarterKit  from '@tiptap/starter-kit'
import Underline   from '@tiptap/extension-underline'
import TextStyle   from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign   from '@tiptap/extension-text-align'

import { EDITOR_STORE } from '../utils'

const store = inject(EDITOR_STORE)!

const FontSizeTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {}
          return { style: `font-size: ${attributes.fontSize}` }
        },
      },
      color: {
        default: null,
        parseHTML: element => element.style.color,
        renderHTML: attributes => {
          if (!attributes.color) return {}
          return { style: `color: ${attributes.color}` }
        },
      },
    }
  },
})

const editor = new Editor({
  content: '',
  extensions: [
    StarterKit,
    Underline,
    FontSizeTextStyle,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: 'Write something …',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'h-[calc(100vh-10rem)] outline-none'
    }
  }
})

const route = useRoute()

watch(
  () => route.query,
  (value) => {
    if (!value.type) return

    const type = value.type as string
    store.selectedType = type

    const content = store.settings[type] as string
    editor.commands.setContent(content)
  },
  { immediate: true },
)

onBeforeUnmount(() => editor.destroy())

defineExpose({
  getHtml: () => editor.getHTML(),
  setHtml: (html: string) => editor.commands.setContent(html),
})
</script>

<template>
  <div>
    <div class="flex items-center flex-wrap p-3 py-2 border-b">
      <div class="space-x-0.5">
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          @click="editor.chain().focus().undo().run()"
        >
          <Icon icon="lucide:undo" class="size-5" />
          <div class="x-tooltip-text top120">撤销</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          @click="editor.chain().focus().redo().run()"
        >
          <Icon icon="lucide:redo" class="size-5" />
          <div class="x-tooltip-text top120">重做</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-2 bg-border" />

      <div class="space-x-0.5">
        <HeadingPicker :editor="editor" />
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          @click="editor.chain().focus().unsetAllMarks().run()"
        >
          <Icon icon="lucide:eraser" class="size-5" />
          <div class="x-tooltip-text top120">清除格式</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-2 bg-border" />

      <div class="space-x-0.5">
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive('bold')}"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <Icon icon="lucide:bold" class="size-5" />
          <div class="x-tooltip-text top120">加粗</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive('italic')}"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <Icon icon="lucide:italic" class="size-5" />
          <div class="x-tooltip-text top120">斜体</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive('underline')}"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <Icon icon="lucide:underline" class="size-5" />
          <div class="x-tooltip-text top120">下划线</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive('strike')}"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <Icon icon="lucide:strikethrough" class="size-5" />
          <div class="x-tooltip-text top120">删除线</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive('codeBlock')}"
          @click="editor.chain().focus().toggleCodeBlock().run()"
        >
          <Icon icon="lucide:code" class="size-5" />
          <div class="x-tooltip-text top120">代码块</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-2 bg-border" />

      <div class="space-x-0.5">
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive('bulletList')}"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <Icon icon="lucide:list" class="size-5" />
          <div class="x-tooltip-text top120">无序列表</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive('orderedList')}"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <Icon icon="lucide:list-ordered" class="size-5" />
          <div class="x-tooltip-text top120">有序列表</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-2 bg-border" />

      <div class="space-x-0.5">
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive({ textAlign: 'left' })}"
          @click="editor.chain().focus().setTextAlign('left').run()"
        >
          <Icon icon="lucide:align-left" class="size-5" />
          <div class="x-tooltip-text top120">左对齐</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive({ textAlign: 'center' })}"
          @click="editor.chain().focus().setTextAlign('center').run()"
        >
          <Icon icon="lucide:align-center" class="size-5" />
          <div class="x-tooltip-text top120">居中对齐</div>
        </button>
        <button
          class="x-tooltip hover:bg-muted rounded p-1.5"
          :class="{'bg-muted': editor.isActive({ textAlign: 'right' })}"
          @click="editor.chain().focus().setTextAlign('right').run()"
        >
          <Icon icon="lucide:align-right" class="size-5" />
          <div class="x-tooltip-text top120">右对齐</div>
        </button>
      </div>

      <hr class="h-5 w-px mx-3 bg-border" />

      <div class="space-x-0.5">
        <FontSizePicker :editor="editor" />
        <TextColorPicker :editor="editor" />
      </div>
    </div>

    <EditorContent :editor="editor" class="p-3 overflow-y-auto" />  
  </div>
</template>

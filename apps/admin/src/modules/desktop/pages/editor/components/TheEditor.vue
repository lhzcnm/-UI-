<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'

import StarterKit  from '@tiptap/starter-kit'
import Underline   from '@tiptap/extension-underline'
import TextStyle   from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'

import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import { XPopover } from '@3un/ui'

const text = ref('')

const openFontSizePicker = ref(false)
const openColorPicker = ref(false)

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
    }
  },
})

const editor = useEditor({
  content: text.value,
  extensions: [
    StarterKit,
    Underline,
    TextAlign,
    FontSizeTextStyle,
    Placeholder.configure({
      placeholder: 'Write something …',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'h-96 outline-none'
    }
  }
})

function selectFontSize(event: Event) {
  const fontSize = (event.target as HTMLSelectElement).value
  editor.value?.chain().focus().setMark('textStyle', { fontSize }).run()
}

function selectHeading(event: Event) {
  const heading = (event.target as HTMLSelectElement).value
  editor.value?.chain().focus().toggleHeading({ level: Number(heading) as any }).run()
}
</script>

<template>
  <div class="border rounded">
    <div class="flex items-center p-2 border-b">
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().undo().run()"
      >
        <Icon icon="lucide:undo" class="size-5" />
      </button>
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().redo().run()"
      >
        <Icon icon="lucide:redo" class="size-5" />
      </button>

      <hr class="h-5 w-px mx-3 bg-border" />

      <!-- heading -->
      <select
        :class="twJoin(
          'px-1.5 py-1 text-sm bg-card hover:bg-muted rounded',
          'border-r-transparent border-r-[5px] ring-1 ring-border'
        )"
        @change="selectHeading"
      >
        <option value="1">h1</option>
        <option value="2">h2</option>
        <option value="3">h3</option>
      </select>

      <hr class="h-5 w-px mx-3 bg-border" />

      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <Icon icon="lucide:bold" class="size-5" />
      </button>
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <Icon icon="lucide:italic" class="size-5" />
      </button>
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <Icon icon="lucide:underline" class="size-5" />
      </button>
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        <Icon icon="lucide:strikethrough" class="size-5" />
      </button>

      <hr class="h-5 w-px mx-3 bg-border" />

      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <Icon icon="lucide:list" class="size-5" />
      </button>
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <Icon icon="lucide:list-ordered" class="size-5" />
      </button>

      <hr class="h-5 w-px mx-3 bg-border" />

      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().setTextAlign('left').run()"
      >
        <Icon icon="lucide:align-left" class="size-5" />
      </button>
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().setTextAlign('center').run()"
      >
        <Icon icon="lucide:align-center" class="size-5" />
      </button>
      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().setTextAlign('right').run()"
      >
        <Icon icon="lucide:align-right" class="size-5" />
      </button>
      
      <hr class="h-5 w-px mx-3 bg-border" />

      <XPopover v-model="openFontSizePicker" trigger="click" placement="bottom-start">
        <template #trigger>
          <button class="hover:bg-muted rounded px-1.5 py-1">
            <Icon icon="iconoir:text-size" class="size-5" />
          </button>
        </template>

        <div class="p-2">
          heello world
        </div>
      </XPopover>

      <button
        class="hover:bg-muted rounded px-1.5 py-1"
        @click="editor?.chain().focus().setTextAlign('right').run()"
      >
        <Icon icon="iconoir:color-picker" class="size-5" />
      </button>
    </div>
    <EditorContent :editor="editor" class="p-2" />  
  </div>
</template>

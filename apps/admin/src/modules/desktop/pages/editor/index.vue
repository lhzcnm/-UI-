<script setup lang="ts">
import TheEditor from './components/TheEditor.vue'
import { useEditor } from '@tiptap/vue-3'

import StarterKit  from '@tiptap/starter-kit'
import Underline   from '@tiptap/extension-underline'
import TextStyle   from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign   from '@tiptap/extension-text-align'

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
  content: '',
  extensions: [
    StarterKit.configure({
      orderedList: {
        HTMLAttributes: {
          class: 'list-decimal pl-5',
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: 'list-disc pl-5',
        },
      },
      paragraph: {
        HTMLAttributes: {
          class: 'text-base',
        },
      },
    }),
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
      class: 'outline-none'
    }
  }
})

</script>

<template>
  <div class="flex space-x-6 p-6">
    <div class="flex-1">
      <TheEditor :editor="editor" />
    </div>
    <div class="flex-1">
      <h2 class="text-xl font-bold mb-3">预览</h2>
      <div class="border rounded p-4" v-html="editor?.getHTML()" />
    </div>
  </div>
</template>

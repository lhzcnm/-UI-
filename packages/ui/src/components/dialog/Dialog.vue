<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { useEventListener } from '@vueuse/core'
import { twMerge } from 'tailwind-merge'

import type { DialogProps, DialogEmits } from './dialog'
import { useFocusLock } from '@/composables/useFocusLock'

defineOptions({ name: 'XDialog' })

const props = withDefaults(
  defineProps<DialogProps>(),
  {
    text: '',
    title: '',
    class: '',
    contentClass: '',
    closeOnEscape: true,
    closeBtn: true,
    interact: true,
  },
)

const emit = defineEmits<DialogEmits>()
const visible = defineModel<boolean>({ required: true })

const isShaking = ref(false)
const dialog = ref<HTMLElement | null>(null)

const { handleTab } = useFocusLock(visible, dialog)

watch(visible, (value) => {
  const body = document.body
  if (value) body.style.overflow = 'hidden'
  else body.style.overflow = ''
})

if (props.closeOnEscape) {
  useEventListener(document, 'keydown', handleKeyDown)
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape')
      handleClose(true)
  }
}

function handleClose(force = false) {
  if (!props.interact && !force) {
    isShaking.value = true
    setTimeout(() => isShaking.value = false, 350)
    return
  }

  visible.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      :class="twMerge(
        'fixed top-0 bottom-0 left-0 right-0 z-50 overflow-y-auto',
        'flex flex-col items-center justify-center',
        'bg-gray-950/70 opacity-0 pointer-events-none',
        visible && 'opacity-100 pointer-events-auto',
        props.class,
      )"
      @click.self="handleClose(false)"
    >
      <Transition name="x-dialog">
        <div
          ref="dialog"
          v-show="visible"
          :class="twMerge(
            'relative p-4 sm:p-6 w-[calc(100%-2rem)] sm:max-w-sm',
            'bg-card rounded-lg will-change-transform',
            isShaking && 'x-shake-animation',
            props.contentClass,
          )"
          @keydown="handleTab"
        >
          <slot name="header">
            <div v-if="title" class="flex justify-between items-center mb-4">
              <div class="text-xl font-semibold">{{ title }}</div>
              <a
                v-if="closeBtn"
                href="javascript:void(0)"
                :class="twMerge(
                  'bg-muted rounded-full p-1 text-muted-foreground',
                  'hover:bg-muted-foreground/10 hover:rotate-90',
                  'transition-all duration-200',
                )"
                @click="handleClose(true)"
              >
                <Icon icon="lucide:x" />
              </a>
            </div>
          </slot>

          <slot>
            <div
              v-html="text"
              class="mb-4 max-h-[75vh] overflow-y-auto"
            />
          </slot>

          <slot name="footer" />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

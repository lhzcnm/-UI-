<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

interface SlideRightProps {
  title?: string
  headerClass?: string
  uiBody?: string
}

interface SlideRightEmits {
  (e: 'close'): void
}

defineProps<SlideRightProps>()
const emit = defineEmits<SlideRightEmits>()
const visible = defineModel<boolean>({ default: false })

// let scrollY = 0

watch(visible, (value) => !value && emit('close'))

// watch(() => visible.value, (v) => {
//   if (v) {
//     scrollY = window.scrollY

//     document.body.style.position = 'fixed'
//     document.body.style.top = `-${scrollY}px`
//     document.body.style.width = '100%'
//     document.body.style.overflow = 'hidden'
//   } else {
//     document.body.style.position = ''
//     document.body.style.top = ''
//     document.body.style.width = ''
//     document.body.style.overflow = ''

//     window.scrollTo(0, scrollY)
//     emit('close')
//   }
// })

// document.addEventListener('touchmove', (e) => {
//   if (visible.value) {
//     e.preventDefault()
//   }
// }, { passive: false })
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-right">
      <div v-if="visible" class="absolute top-0 bottom-0 left-0 right-0 z-30 flex flex-col bg-background" @touchmove.prevent>
        <section :class="twMerge('relative flex items-center px-3 h-mobile-header', headerClass)">
          <button class="absolute left-3 text-muted-foreground" @click="visible = false">
            <Icon icon="lucide:chevron-left" class="size-6" />
          </button>
          <div class="pl-9 text-lg font-medium truncate">{{ title }}</div>
        </section>
        <section class="flex-1 overflow-y-auto" :class="uiBody">
          <slot />
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

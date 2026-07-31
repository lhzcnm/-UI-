<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

interface SlideRightProps {
  title?: string
  headerClass?: string
  uiBody?: string
  touchPreventDefault?: boolean
}

interface SlideRightEmits {
  (e: 'close'): void
}

const props = defineProps<SlideRightProps>()
const emit = defineEmits<SlideRightEmits>()
const visible = defineModel<boolean>({ default: false })

// let scrollY = 0

watch(visible, (value) => !value && emit('close'))

function handleTouch(e: Event) {
  if (props.touchPreventDefault) {
    e.preventDefault()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-right">
      <div v-if="visible" class="absolute top-0 bottom-0 left-0 right-0 z-30 flex flex-col bg-background" @touchmove="handleTouch">
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

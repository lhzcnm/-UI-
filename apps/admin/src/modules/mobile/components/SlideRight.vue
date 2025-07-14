<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

interface SlideRightProps {
  title?: string
  headerClass?: string
}

interface SlideRightEmits {
  (e: 'close'): void
}

defineProps<SlideRightProps>()
const emit = defineEmits<SlideRightEmits>()
const visible = defineModel<boolean>({ default: false })

watch(visible, (value) => !value && emit('close'))
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-right">
      <div v-if="visible" class="absolute top-0 bottom-0 left-0 right-0 z-30 flex flex-col bg-background">
        <section :class="twMerge('relative flex items-center px-3 h-header border-b', headerClass)">
          <button class="absolute left-3 text-muted-foreground" @click="visible = false">
            <Icon icon="lucide:chevron-left" class="size-6" />
          </button>
          <div class="pl-9 text-lg font-medium truncate">{{ title }}</div>
        </section>
        <section class="flex-1 overflow-y-auto">
          <slot />
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

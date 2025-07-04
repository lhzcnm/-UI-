<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

interface TheModalProps {
  title: string
  class?: string
}

interface TheModalEmits {
  (e: 'close'): void
}

const props = defineProps<TheModalProps>()
const emit = defineEmits<TheModalEmits>()
const visible = defineModel<boolean>({ default: false })

watch(visible, (value) => !value && emit('close'))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade-in">
      <div
        v-if="visible"
        class="fixed top-0 bottom-0 left-0 right-0 z-40 bg-black/40"
        @click="visible = false"
      />
    </Transition>

    <Transition name="slide-bottom">
      <div
        v-if="visible"
        :class="twMerge(
          'fixed left-0 right-0 bottom-0 z-40 will-change-transform',
          'h-[90%] bg-card rounded-t-[10px] overflow-y-auto',
          props.class,
        )"
      >
        <div class="w-16 h-1 my-2 bg-muted rounded mx-auto" />
        <div class="flex items-center justify-between px-4 pb-3">
          <h2 class="flex-1 mr-3 truncate text-xl font-semibold">{{ props.title }}</h2>
          <button
            class="bg-muted rounded p-1 text-muted-foreground"
            @click="visible = false"
          >
            <Icon icon="lucide:x" class="size-5" />
          </button>
        </div>
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

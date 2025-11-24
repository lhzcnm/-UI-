<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface SlideRightProps {
  title?: string,
}

interface SlideRightEmits {
  close: []
}

defineProps<SlideRightProps>()
const emits = defineEmits<SlideRightEmits>()
const visible = defineModel<boolean>({ default: false })

watch(visible, (value) => !value && emits("close"))
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-right">
      <div v-if="visible" class="absolute top-0 bottom-0 left-0 right-0 z-30 flex flex-col bg-background">
        <section class="relative flex items-center px-3 h-mobile-header border-b">
          <button class="absolute left-3 text-muted-foreground" @click="visible = false">
            <Icon icon="lucide:chevron-left" class="size-6" />
          </button>
          <div class="pl-9 text-lg font-medium truncate">{{ title }}</div>
        </section>
        <section class="flex-1 overflow-y-auto">
          <slot name="default" />
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

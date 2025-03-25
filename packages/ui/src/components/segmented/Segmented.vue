<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { tv } from 'tailwind-variants'
import type { SegmentedProps } from './segmented'
import { twMerge } from 'tailwind-merge'

defineOptions({ name: 'XSegmented' })

const props = defineProps<SegmentedProps>()
const active = defineModel({ required: true })

const segmented = tv({
  slots: {
    base: 'relative p-1 bg-card rounded-lg border',
    container: 'relative flex',
    indicator: [
      'absolute h-full rounded-md shadow-sm',
      'transition-transform duration-300 ease-in-out'
    ],
    button: [
      'relative flex-1 flex items-center justify-center space-x-1.5',
      'text-zinc-500 transition-colors duration-300',
    ],
    activeButton: 'text-primary',
    icon: 'size-4',
  },
  variants: {
    color: {
      blue: {
        indicator: 'bg-primary',
        activeButton: 'text-white',
      },
      emerald: {
        indicator: 'bg-emerald-600',
        activeButton: 'text-white',
      },
    },
    size: {
      sm: {
        button: 'px-2.5 text-xs h-7 sm:h-6',
        icon: 'size-3.5',
      },
      md: {
        button: 'px-3 text-sm h-9 sm:h-7',
        icon: 'size-4',
      },
    }
  },
  defaultVariants: {
    color: 'blue',
    size: 'md',
  }
})

const sg = segmented({ color: props.color, size: props.size })
const activeIndex = computed(() => props.options.findIndex((opt) => opt.value === active.value))
</script>

<template>
  <div :class="sg.base({ class: props.class })">
    <div :class="sg.container()">
      <div
        :class="sg.indicator()"
        :style="{
          transform: `translateX(${activeIndex * 100}%)`,
          width: `${100 / options.length}%`,
        }"
      />

      <button
        v-for="option in options"
        :key="option.value" type="button"
        :class="twMerge(sg.button(), active === option.value && sg.activeButton())"
        @click="active = option.value"
      >
        <Icon
          v-if="option.icon"
          :icon="option.icon"
          :class="sg.icon()"
        />
        <span>{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

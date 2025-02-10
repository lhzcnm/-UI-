<script setup lang="ts">
import type { XPopoverProps, XPopoverSlots, XPopoverEmits } from './popover'
import { useFloating, offset, flip, shift } from '@floating-ui/vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { useFocusLock } from '@/composables/useFocusLock'

defineOptions({ name: 'XPopover' })

const props = withDefaults(
  defineProps<XPopoverProps>(),
  {
    placement: 'bottom',
    offset: 8,
    arrow: false,
    closeOnClickOutside: false,
    closeOnEscape: true,
  }
)

const emit = defineEmits<XPopoverEmits>()
const slots = defineSlots<XPopoverSlots>()
const open = defineModel<boolean>({ required: true })
const floating = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)

const renderTrigger = () => {
  if (!slots.trigger) return null
  const triggerContent = slots.trigger()[0]
  const triggerVNode = h(
    triggerContent.type as Component,
    {
      ref: trigger,
      onClick: () => open.value = !open.value,
      ...triggerContent.props
    },
    triggerContent.children as VNode[]
  )

  return triggerVNode
}

const { floatingStyles } = useFloating(
  trigger, floating,
  {
    open,
    placement: props.placement,
    middleware: [
      offset(props.offset),
      flip(),
      shift()
    ]
  }
)

const { handleTab } = useFocusLock(open, floating)

watch(open, (val) => !val && emit('closed'), { flush: 'post' })

onClickOutside(
  floating,
  () => {
    if (props.closeOnClickOutside) {
      open.value = false
    }
  },
  { ignore: [trigger] }
)

if (props.closeOnEscape) {
  useEventListener(document, 'keydown', handleKeyDown)
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      open.value = false
    }
  }
}
</script>

<template>
  <component :is="renderTrigger()" />
  <Teleport to="body">
    <Transition>
      <div
        v-show="open"
        ref="floating"
        class="z-50"
        :style="floatingStyles"
        :aria-modal="true"
        @keydown="handleTab"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

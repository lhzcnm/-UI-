<script setup lang="ts">
import type { XPopoverProps, XPopoverSlots, XPopoverEmits } from './popover'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'
import { onClickOutside, useEventListener } from '@vueuse/core'
import { useFocusLock } from '@/composables/useFocusLock'
import { twMerge } from 'tailwind-merge'

defineOptions({ name: 'XPopover' })

const props = withDefaults(
  defineProps<XPopoverProps>(),
  {
    placement: 'bottom',
    offset: 8,
    arrow: false,
    closeOnClickOutside: false,
    closeOnEscape: true,
    teleport: 'body',
    trigger: 'click',
    hoverDelay: 200,
    animation: true,
  }
)

const emit = defineEmits<XPopoverEmits>()
const slots = defineSlots<XPopoverSlots>()
const open = defineModel<boolean>({ required: true })

const floating = ref<HTMLElement | null>(null)
const trigger = ref<HTMLElement | null>(null)

const hoverTimeout = ref<number>()
const currentPlacement = ref(props.placement)

const renderTrigger = () => {
  if (!slots.trigger) return null
  const triggerContent = slots.trigger()[0]
  const eventHandlers: Record<string, () => void> = {}

  if (props.trigger === 'click') {
    eventHandlers.onClick = () => open.value = !open.value
  }
  else if (props.trigger === 'hover') {
    eventHandlers.onMouseenter = () => {
      if (hoverTimeout.value) clearTimeout(hoverTimeout.value)
      open.value = true
    }
    eventHandlers.onMouseleave = () => {
      hoverTimeout.value = window.setTimeout(() => 
        open.value = false,
        props.hoverDelay
      )
    }
  }

  const triggerVNode = h(
    triggerContent.type as Component,
    {
      ref: trigger,
      ...eventHandlers,
      ...triggerContent.props
    },
    triggerContent.children as VNode[]
  )

  return triggerVNode
}

const { handleTab } = useFocusLock(open, floating)

const { floatingStyles, placement } = useFloating(
  trigger, floating,
  {
    open,
    placement: props.placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(props.offset),
      flip(),
      shift(),
    ]
  }
)

watch(placement, (newPlacement) => {
  currentPlacement.value = newPlacement
  updateTransformOrigin()
})

watch(
  open,
  (val) => !val && emit('closed'),
  { flush: 'post' }
)

onMounted(() => updateTransformOrigin())

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

function updateTransformOrigin() {
  const origins = {
    'top': 'bottom center',
    'top-start': 'bottom left',
    'top-end': 'bottom right',

    'right': 'left center',
    'right-start': 'left top',
    'right-end': 'left bottom',

    'bottom': 'top center',
    'bottom-start': 'top left',
    'bottom-end': 'top right',

    'left': 'right cenetr',
    'left-start': 'right top',
    'left-end': 'right bottom',
  }

  const origin = origins[currentPlacement.value] || 'top'

  nextTick(() => {
    if (!floating.value) return
    const style = floating.value.style
    style.setProperty('--x-popover-origin', origin)
  })
}

function handleMouseEnter() {
  if (props.trigger === 'hover') {
    window.clearTimeout(hoverTimeout.value)
    open.value = true
  }
}

function handleMouseLeave() {
  if (props.trigger === 'hover') {
    hoverTimeout.value = window.setTimeout(
      () => open.value = false,
      props.hoverDelay
    )
  }
}

function getTeleportTo() {
  const isString = typeof props.teleport === 'string'
  if (isString) return props.teleport
  return props.teleport || 'body'
}
</script>

<template>
  <component :is="renderTrigger()" />
  <Teleport
    :to="getTeleportTo()"
    :disabled="teleport === false"
  >
    <div
      ref="floating"
      class="z-50"
      :style="floatingStyles"
      :aria-modal="true"
      @keydown="handleTab"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <Transition 
        name="x-popover" appear
        :disabled="!props.animation"
      >
        <div
          v-show="open"
          :class="twMerge(
            'bg-card border rounded-md shadow-lg',
            props.contentClass
          )"
        >
          <slot />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { XBtnColor, XBtnSize, XBtnVariant } from '@3un/ui'

const ButtonLayouts = [
  "filter",
  "import",
  "export",
  "submit",
  "confirm",
  "clear",
  "copy",
  "add",
  "cancel",
] as const

type ButtonLayout = (typeof ButtonLayouts)[number]

interface ButtonConfigItem {
  color: XBtnColor,
  variant: XBtnVariant,
}

interface ButtonGroupProps {
  layouts: ButtonLayout[],
  size?: XBtnSize,
}

interface ButtonGroupEmits {
  filter: [],
  import: [],
  export: [],
  submit: [],
  confirm: [],
  clear: [],
  print: [],
  copy: [],
  generate: [],
  add: [],
  cancel: [],
}

type ButtonConfig = Record<ButtonLayout, ButtonConfigItem>
type ButtonLabel = Record<ButtonLayout, string>

withDefaults(
  defineProps<ButtonGroupProps>(),
  {
    size: 'md'
  }
)

const emits = defineEmits<ButtonGroupEmits>()

const { t } = useI18n()

const buttonConfigs: ButtonConfig = {
  filter: { color: 'primary', variant: 'solid' },
  import: { color: 'primary', variant: 'solid' },
  export: { color: 'success', variant: 'solid' },
  submit: { color: 'primary', variant: 'solid' },
  confirm: { color: 'primary', variant: 'solid' },
  clear: { color: 'danger', variant: 'solid' },
  copy: { color: 'primary', variant: 'ghost', },
  add: { color: 'primary', variant: 'solid' },
  cancel: { color: 'primary', variant: 'soft' },
}

const buttonLabels: ButtonLabel = {
  filter: t('button.filter'),
  import: t('button.import'),
  export: t('button.export'),
  submit: t('button.submit'),
  confirm: t('button.confirm'),
  clear: t('button.clear'),
  copy: t('button.copy'),
  add: t('button.add'),
  cancel: t('button.cancel'),
}

function handleClick(layout: ButtonLayout) {
  // @ts-ignore
  emits(layout)
}
</script>

<template>
  <template v-for="layout in layouts">
    <XButton
      :color="buttonConfigs[layout].color"
      :variant="buttonConfigs[layout].variant"
      :label="buttonLabels[layout]"
      :size="size"
      @click="handleClick(layout)"
    />
  </template>
</template>

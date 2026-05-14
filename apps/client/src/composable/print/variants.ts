import type { LabelCreateForm } from "@/types"
import {
  type ContainerItem,
  type PaperDirectionOption,
  type PrintHeader,
  type TemplateItem
} from "@/types"
import {
  LAYOUT_POSITION,
  PRINT_TYPE,
  type HeaderTag,
  type TemplateResp
} from "@/types/print"
import { mmToPx } from "@/utils"

export function printVariants() {
  const { t, locale } = useI18n()

  const container = reactive<ContainerItem>({
    width: 40,
    height: 60,
    padding: {
      top: 0,
      right: 4,
      bottom: 0,
      left: 0,
    },
    orientation: "landscape",
    layout: LAYOUT_POSITION.FREE,
  })
  const isOverflowMap = reactive<Record<string, boolean>>({})
  const templateItems = ref<TemplateItem[]>([])
  const serviceCols = ref<PrintHeader[]>([])
  const selectCols = ref<string[]>([])
  const generating = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const printer = ref<string>('')
  const qrcodeKeys = ref<string[]>([])
  const visibleSelQrHeader = ref<boolean>(false)
  const printType = ref<PRINT_TYPE>(PRINT_TYPE.TSPL)
  const customLabels = ref<Record<string, LabelCreateForm>>({})
  const dbTemplates = ref<TemplateResp[]>([])
  const templateId = ref<number>()

  const directionOptions: PaperDirectionOption[] = [
    { value: 'portrait', label: t('print.direction.portrait') },
    { value: 'landscape', label: t('print.direction.landscape') },
  ]
  const functionItems: PrintHeader[] = [
    { key: "AddTemplate", name: "添加自定义标签", nameEn: "Add Custom Label", type: "Function" }
  ]

  let storageUrl: string[] = []
  let qrFieldKeys: PrintHeader[] = []

  const isEn = computed(() => locale.value === "en")

  const processedColumns = computed<HeaderTag[]>(() => (
    serviceCols.value.map(item => ({
      key: item.key,
      label: isEn.value ? item.nameEn : item.name,
      type: item.type
    }))
  ))

  const paperStyle = computed(() => {
    const isLandscape = container.orientation === 'landscape'

    const width = isLandscape ? container.height : container.width
    const height = isLandscape ? container.width : container.height

    return {
      width: `${mmToPx(width)}px`,
      height: `${mmToPx(height)}px`,
      padding: `${mmToPx(container.padding.top)}px
      ${mmToPx(container.padding.right)}px
      ${mmToPx(container.padding.bottom)}px
      ${mmToPx(container.padding.left)}px`,
    }
  })

  const safeAreaStyle = computed(() => {
    const isLandscape = container.orientation === 'landscape'

    const width = isLandscape ? container.height : container.width
    const height = isLandscape ? container.width : container.height

    const { padding } = container

    const left = mmToPx(padding.left)
    const top = mmToPx(padding.top)

    const w =
      mmToPx(width) -
      mmToPx(padding.left + padding.right)

    const h =
      mmToPx(height) -
      mmToPx(padding.top + padding.bottom)

    return {
      left: left + 'px',
      top: top + 'px',
      width: w + 'px',
      height: h + 'px',
    }
  })

  return {
    container,
    isOverflowMap,
    templateItems,
    serviceCols,
    selectCols,
    generating,
    loading,
    printer,
    qrcodeKeys,
    visibleSelQrHeader,
    printType,
    customLabels,
    dbTemplates,
    templateId,

    directionOptions,
    functionItems,
    storageUrl,
    qrFieldKeys,

    isEn,
    processedColumns,
    paperStyle,
    safeAreaStyle,
  }
}

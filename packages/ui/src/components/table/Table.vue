<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import { useResizeObserver } from '@vueuse/core'

import type { TableProps, TableEmits, TableColumn } from './table'
import { ua } from '@3un/utils'

defineOptions({ name: 'XTable' })

const props = defineProps<TableProps>()
const emit = defineEmits<TableEmits>()

const selectedList = ref(new Set<any>())
const rootRef = shallowRef<HTMLElement | null>()
const rootClientOpt = ref({
  hasHRoll: false,
  hasVRoll: false,
  height: 0,
  width: 0,
})

const scalableWidth = ref(0)
const tableWidth = ref(0)

const mergeColumns = computed(() => {
  if (!props.selection) return props.columns
  return [
    {
      key: 'selection',
      align: 'center',
      width: 55,
      headerRender: renderSelectionTh,
      render: renderSelectionTd,
    } as TableColumn,
    ...props.columns,
  ]
})

const minWidthOpt = computed(() => {
  const result: Record<string, number> = { sumWidth: 0, count: 0 }
  for (let i = 0; i < mergeColumns.value.length; i++) {
    const col = mergeColumns.value[i]
    if (col.minWidth) {
      result.sumWidth += col.minWidth
      result.count++
    }
  }

  for (let i = 0; i < mergeColumns.value.length; i++) {
    const col = mergeColumns.value[i]
    if (col.minWidth && result.sumWidth > 0) {
      const rate = col.minWidth / result.sumWidth
      result[i] = parseFloat(rate.toFixed(4))
    }
  }

  return result
})

let stopObserver: any = null

watch(
  () => props.columns.length,
  () => tableWidthObserver(),
  { immediate: true }
)

function tableWidthObserver() {
  stopObserver && stopObserver()
  const fixedWidth = mergeColumns.value
    .reduce((pre, cur) => pre + (cur.width || 0), 0)

  if (minWidthOpt.value.count > 0 && fixedWidth > 0) {
    const sumWidth = minWidthOpt.value.sumWidth
    const tableMinWidth = fixedWidth + sumWidth
    const { stop } = useResizeObserver(rootRef, (entries) => {
      const width = entries[0].contentRect.width
      const target = entries[0].target

      tableWidth.value = Math.max(width, tableMinWidth)
      scalableWidth.value = tableWidth.value - fixedWidth
      rootClientOpt.value = {
        width: target.clientWidth,
        height: target.clientHeight,
        hasHRoll: target.scrollWidth > target.clientWidth,
        hasVRoll: target.scrollHeight > target.clientHeight,
      }
    })

    stopObserver = stop
  }
}

function renderSelectionTh(rows: any[]) {
  let allSelected = false

  if (rows.length > 0) {
    allSelected = rows.every(row => {
      const key = props.selectedKey ? row[props.selectedKey] : row
      return selectedList.value.has(key)
    })
  }

  return h('input', {
    type: 'checkbox',
    name: 'select-all',
    class: 'size-4 align-middle',
    checked: allSelected,
    onChange: (e: InputEvent) => {
      const target = e.target as HTMLInputElement
      let list: any = null

      if (props.selectedKey) list = rows.map(row => row[props.selectedKey!])
      selectedList.value = new Set(target.checked ? list || rows : [])
      emit('select-change', Array.from(selectedList.value))
    },
  })
}

function renderSelectionTd(_: any, row: any) {
  const key = props.selectedKey ? row[props.selectedKey] : row

  return h('input', {
    type: 'checkbox',
    name: 'row-select',
    class: 'size-4 align-middle',
    checked: selectedList.value.has(key),
    onChange: (e: InputEvent) => {
      const target = e.target as HTMLInputElement

      if (target.checked) selectedList.value.add(key)
      else selectedList.value.delete(key)
      emit('select-change', Array.from(selectedList.value))
    },
  })
}

function renderTh(column: TableColumn, data: any[]) {
  const className = twMerge(
    'py-3 px-2 align-bottom border-b',
    column.thClassName,
    column.visible === false && 'hidden',
    column.align && `text-${column.align}`,
    column.fixed && 'sticky bg-card border-l',
    column.fixed === 'right' ? 'right-0' : 'left-0',
  )

  const node = column.headerRender
    ? column.headerRender(data)
    : column.title

  return h('th', { class: className }, node)
}

function renderTd(row: any, index: number, column: TableColumn) {
  const className = twMerge(
    'p-2 border-b',
    column.tdClassName,
    column.visible === false && 'hidden',
    column.align && `text-${column.align}`,
    column.fixed && 'sticky bg-card border-l',
    column.fixed === 'right' ? 'right-0' : 'left-0',
  )

  if (!column.render) return h('td', { class: className }, row[column.key])
  const node = column.render(row[column.key], row, index)

  if (column.fixed) {
    return h(
      'td', { class: className },
      h('div', { class: 'space-x-2' }, node),
    )
  }

  return h('td', { class: className }, node)
}

function rowClickWrapper(eventName: any) {
  return function (e: MouseEvent) {
    const target = e.target as HTMLElement
    const element = target.closest('[data-index]')
    if (!element) return

    const dataIndex = element.getAttribute('data-index')
    const index = parseInt(dataIndex || '0')

    if (index === -1) return
    emit(eventName, props.data[index], index)
  }
}

const handleRowClick = rowClickWrapper('row-click')
const handleRowDblClick = rowClickWrapper('row-dblclick')

function getColWidth(column: TableColumn, idx: number) {
  if (column.width) return column.width
  if (column.minWidth) {
    const scaleFactor = minWidthOpt.value[idx]
    const width = scaleFactor * scalableWidth.value
    return Math.max(+width.toFixed(2), column.minWidth)
  }

  return 0
}
</script>

<template>
  <div ref="rootRef" class="border rounded-lg bg-card overflow-auto">
    <div
      v-if="ua.browser !== 'Firefox'"
      class="fixed z-10 pointer-events-none"
      :class="{
        'border-b': rootClientOpt.hasHRoll,
        'border-r': rootClientOpt.hasVRoll,
      }"
      :style="{
        width: `${rootClientOpt.width}px`,
        height: `${rootClientOpt.height}px`,
      }"
    />
    <table
      :style="`width: ${tableWidth}px`"
      class="w-full table-fixed border-separate border-spacing-0 text-sm"
    >
      <colgroup>
        <template v-for="(col, idx) in mergeColumns" :key="col.key">
          <col
            v-if="col.visible !== false"
            :width="getColWidth(col, idx)"
          />
        </template>
      </colgroup>
      <thead class="sticky top-0 z-10 bg-card">
        <tr class="text-left">
          <template v-for="column in mergeColumns" :key="column.key">
            <component :is="renderTh(column, data)" />
          </template>
        </tr>
      </thead>
      <tbody
        :class="{ 'h-96': !data.length }"
        @click="handleRowClick"
        @dblclick="handleRowDblClick"
      >
        <tr v-if="data.length === 0" class="text-center" data-index="-1">
          <td :colspan="mergeColumns.length" class="min-h-24">
            {{ emptyText || '这里空空如也' }}
          </td>
        </tr>
        <tr
          v-for="(row, index) in data"
          :key="rowKey ? row[rowKey] : index"
          :data-index="index"
        >
          <component
            v-for="column in mergeColumns" :key="column.key"
            :is="renderTd(row, index, column)"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { TableProps, TableEmits, TableColumn } from './table'
import useDefer from '@/composables/useDefer'

defineOptions({ name: 'XTable' })

const props = defineProps<TableProps>()
const emit = defineEmits<TableEmits>()

const defer = useDefer()
const selectedList = defineModel<any[]>(
  'selectedList',
  { default: () => [] },
)

const _columns = computed(() => {
  if (!props.selection) return props.columns
  return [
    {
      key: 'selection',
      width: 55,
      align: 'center',
      headerRender: (rows) => {
        let allSelected = false

        if (rows.length > 0) {
          allSelected = rows.every(row => {
            const key = props.selectedKey ? row[props.selectedKey] : row
            return selectedList.value.includes(key)
          })
        }

        return h('input', {
          type: 'checkbox',
          class: 'size-4 align-middle',
          checked: allSelected,
          onChange: (e: InputEvent) => {
            const target = e.target as HTMLInputElement
            const list = rows.map(row => props.selectedKey ? row[props.selectedKey] : row)
            selectedList.value = target.checked ? list : []
          },
        })
      },
      render: (_, row) => {
        const key = props.selectedKey ? row[props.selectedKey] : row

        return h('input', {
          type: 'checkbox',
          class: 'size-4 align-middle',
          checked: selectedList.value.includes(key),
          onChange: (e: InputEvent) => {
            const target = e.target as HTMLInputElement
            const newList = new Set(selectedList.value)

            if (target.checked) newList.add(key)
            else newList.delete(key)

            selectedList.value = Array.from(newList)
          },
        })
      },
    } as TableColumn,
    ...props.columns,
  ]
})

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
      h('div',
        { class: 'space-x-2' },
        node,
      ),
    )
  }

  return h('td', { class: className }, node)
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
</script>

<template>
  <div class="border rounded-lg bg-card overflow-auto">
    <table class="w-full table-fixed border-separate border-spacing-0 text-sm">
      <colgroup>
        <template v-for="column in _columns" :key="column.key">
          <col
            v-if="column.visible !== false"
            :style="{ width: `${column.width}px` }"
          />
        </template>
      </colgroup>
      <thead class="sticky top-0 z-10 bg-card">
        <tr class="text-left">
          <template v-for="column in _columns" :key="column.key">
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
          <td :colspan="columns.length" class="min-h-24">
            {{ emptyText || '这里空空如也' }}
          </td>
        </tr>
        <tr
          v-for="(row, index) in data"
          :key="rowKey ? row[rowKey] : index"
          :data-index="index"
        >
          <template v-if="defer(index)">
            <component
              v-for="column in _columns" :key="column.key"
              :is="renderTd(row, index, column)"
            />
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

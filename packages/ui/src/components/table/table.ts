export interface TableColumn {
  key: string
  title?: string
  width?: number
  flex?: boolean
  visible?: boolean
  thClassName?: string
  tdClassName?: string
  fixed?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any, index: number) => any
  headerRender?: (rows: any[]) => any
}

export interface TableProps {
  data: Record<string, any>[]
  columns: TableColumn[]
  selection?: boolean
  selectedKey?: string
  rowKey?: string
  loading?: boolean
  emptyText?: string
}

export interface TableEmits {
  (e: 'row-click', row: any, index: number): void
  (e: 'row-dblclick', row: any, index: number): void
}

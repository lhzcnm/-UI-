import type { ClassNameValue } from 'tailwind-merge'

export interface DialogProps {
  class?: ClassNameValue

  /**
   * 弹窗内容样式
   * @default ''
   */
  contentClass?: string

  /**
   * 弹窗内容
   * @default ''
   */
  text?: string

  /**
   * 弹窗标题
   * @default ''
   */
  title?: string

  /**
   * 弹窗是否显示关闭按钮
   * @default false
   */
  closeBtn?: boolean

  /**
   * 弹窗是否允许与外部交互，如：点击外部关闭
   * @default true
   */
  interact?: boolean

  /**
   * 弹窗是否允许按 Esc 键关闭
   * @default true
   */
  closeOnEscape?: boolean
}

export interface DialogEmits {
  (e: 'close'): void
}

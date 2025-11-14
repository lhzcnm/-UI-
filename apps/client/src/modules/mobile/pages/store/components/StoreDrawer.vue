<script setup lang="ts">
import { tv } from 'tailwind-variants'

const visible = defineModel<boolean>({ default: false, required: true })

const style = tv({
  slots: {
    root: [
      'fixed inset-0 z-50 flex justify-end items-stretch',
    ],
    mask: [
      'absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
    ],
    drawer: [
      'relative z-20 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100',
      'flex flex-col w-[80vw] h-full shadow-2xl border-l border-gray-200 dark:border-neutral-800',
      'rounded-l-2xl overflow-hidden',
    ],
    header: [
      'flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-800',
      'text-base font-semibold',
    ],
    content: [
      'flex-1 overflow-y-auto px-4 py-4 space-y-4',
      'scrollbar-none',
    ],
    footer: [
      'px-4 py-3 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900',
      'flex gap-3 sticky bottom-0',
    ],
    btn: [
      'flex-1 h-10 rounded-lg font-medium transition-colors duration-200',
      'text-sm flex items-center justify-center',
    ],
    btnReset: [
      'border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300',
      'hover:bg-gray-50 dark:hover:bg-neutral-800',
    ],
    btnConfirm: [
      'bg-primary text-white hover:bg-primary/90 active:scale-[0.98]',
    ],
  }
})

const b = style()

function closeDrawer() {
  visible.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-right">
      <div v-if="visible" :class="b.root()">
        <div :class="b.mask()" @click="closeDrawer"></div>

        <div :class="b.drawer()">
          <div :class="b.header()">
            <span>筛选条件</span>
            <button class="text-sm text-gray-500" @click="closeDrawer">关闭</button>
          </div>

          <div :class="b.content()">
            <slot name="default">
              <div class="text-gray-500 dark:text-gray-400 text-sm">
                这里放筛选内容，例如品牌、价格、服务类型等。
              </div>
            </slot>
          </div>
          
          <div :class="b.footer()">
            <button :class="[b.btn(), b.btnReset()]">重置</button>
            <button :class="[b.btn(), b.btnConfirm()]">确认</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

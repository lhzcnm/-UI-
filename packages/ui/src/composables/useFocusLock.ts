import type { Ref } from 'vue'

export function useFocusLock(
  open: Ref<boolean>,
  floating: Ref<HTMLElement | null>
) {
  const originalTabIndexes = new Map<HTMLElement, string | null>()
  const focusableElements = shallowRef<HTMLElement[]>([])
  const originalFocus = ref<HTMLElement | null>(null)

  watch(open, (newValue) => {
    if (!newValue) return restoreOutsideFocus()

    const app = document.getElementById('app') as HTMLElement
    focusableElements.value = getFocusableElements(app)
    originalFocus.value = document.activeElement as HTMLElement

    nextTick(() => {
      disableOutsideFocus()
      const el = floating.value!

      focusableElements.value = getFocusableElements(el)
      const input = el.querySelector<HTMLInputElement>('[autofocus]')
      if (input) input.focus()
      else focusableElements.value[0].focus()
    })
  })

  onBeforeUnmount(() => {
    if (open.value) 
      restoreOutsideFocus()
  })

  function disableOutsideFocus() {
    if (!floating.value) return

    focusableElements.value.forEach(element => {
      if (
        !floating.value?.contains(element) &&
        !originalTabIndexes.has(element)
      ) {
        const tabindex = element.getAttribute('tabindex')
        originalTabIndexes.set(element, tabindex)
        element.setAttribute('tabindex', '-1')
      }
    })
  }

  function restoreOutsideFocus() {
    originalTabIndexes.forEach((tabindex, element) => {
      if (tabindex === null) element.removeAttribute('tabindex')
      else element.setAttribute('tabindex', tabindex)
    })

    if (originalFocus.value)
      originalFocus.value.focus()

    originalTabIndexes.clear()
  }

  function getFocusableElements(element: HTMLElement): HTMLElement[] {
    const focusableElement = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    return Array.from<HTMLElement>(element.querySelectorAll(focusableElement))
  }

  function handleTab(e: KeyboardEvent) {
    if (!floating.value || e.key !== 'Tab') return
    if (!focusableElements.value.length) return
  
    const len = focusableElements.value.length
    const firstElement = focusableElements.value[0]
    const lastElement = focusableElements.value[len - 1]
    const activeElement = document.activeElement

    // Shift + Tab
    if (e.shiftKey) {
      if (activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    }
    // Tab
    else {
      if (activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  return {
    originalTabIndexes,
    focusableElements,
    getFocusableElements,
    disableOutsideFocus,
    restoreOutsideFocus,
    handleTab,
  }
}

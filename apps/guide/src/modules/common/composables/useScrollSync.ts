import { ref, watch, type Ref } from 'vue'
import type { ContentItem } from '../types'

export function useScrollSync(
  contentRef: Ref<HTMLElement | null>,
  contentList: Ref<ContentItem[]>,
  activeId: Ref<string>,
  setActive: (id: string) => void,
  getMenuIdFromContentId: (id: string) => string
) {
  let scrollTicking = false

  function updateActiveOnScroll() {
    if (!contentRef.value || contentList.value.length === 0) return
    const sections = contentList.value
      .map(item => ({
        id: item.value,
        element: document.getElementById(item.value)
      }))
      .filter(s => s.element)

    if (!sections.length) return
    const container = contentRef.value
    const containerRect = container.getBoundingClientRect()

    let currentSection = sections[0].id
    let minDistance = Infinity
    sections.forEach(section => {
      const rect = section.element!.getBoundingClientRect()
      const distance = Math.abs(rect.top - containerRect.top)
      if (rect.bottom > containerRect.top && rect.top < containerRect.bottom) {
        if (distance < minDistance) { minDistance = distance; currentSection = section.id }
      } else if (rect.top <= containerRect.top) {
        if (distance < minDistance) { minDistance = distance; currentSection = section.id }
      }
    })

    const menuId = getMenuIdFromContentId(currentSection)
    if (menuId && activeId.value !== menuId) {
      setActive(menuId)
    }
  }

  function onScroll() {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        updateActiveOnScroll()
        scrollTicking = false
      })
      scrollTicking = true
    }
  }

  function bindScroll() {
    if (contentRef.value) {
      contentRef.value.addEventListener('scroll', onScroll)
    }
  }

  function unbindScroll() {
    if (contentRef.value) {
      contentRef.value.removeEventListener('scroll', onScroll)
    }
  }

  watch(contentList, updateActiveOnScroll, { flush: 'post' })

  return { bindScroll, unbindScroll }
}
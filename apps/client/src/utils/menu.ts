interface MenuType {
  label: string
  command: (e?: any) => void
  visible?: () => boolean
  disabled?: () => boolean
}

let currentEditableTarget:
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLElement
  | null = null

function getFocusedEditableElement() {
  const el = document.activeElement

  if (!el) return null

  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement
  ) {
    return el
  }

  if (el instanceof HTMLElement && el.isContentEditable) {
    return el
  }

  return null
}

async function handlePaste(e?: Event) {
  e?.preventDefault()
  e?.stopPropagation()

  // const target = getFocusedEditableElement()

  if (!currentEditableTarget) return

  try {
    const text = await navigator.clipboard.readText()

    if (
      currentEditableTarget instanceof HTMLInputElement ||
      currentEditableTarget instanceof HTMLTextAreaElement
    ) {
      const start = currentEditableTarget.selectionStart ?? 0
      const end = currentEditableTarget.selectionEnd ?? 0

      currentEditableTarget.setRangeText(
        text,
        start,
        end,
        'end'
      )

      currentEditableTarget.dispatchEvent(
        new Event('input', { bubbles: true })
      )

      return
    }

    if (
      currentEditableTarget instanceof HTMLElement &&
      currentEditableTarget.isContentEditable
    ) {
      insertTextToContentEditable(text)
    }

  } catch (err) {
    console.error(err)
  }
}

function insertTextToContentEditable(
  // target: HTMLElement,
  text: string
) {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    return 
  }

  const range = selection.getRangeAt(0)
   // 删除选中内容
  range.deleteContents()

  // 插入文本节点
  const textNode = document.createTextNode(text)

  range.insertNode(textNode)

  // 光标移动到文本后
  range.setStartAfter(textNode)
  range.setEndAfter(textNode)

  selection.removeAllRanges()
  selection.addRange(range)
}

function handleSelection() {
  const selection = window.getSelection()
  const range = document.createRange()

  range.selectNodeContents(document.body)

  selection?.removeAllRanges()
  selection?.addRange(range)
}

const menus: MenuType[] = [
  {
    label: '全选',
    command: () => handleSelection()
  },
  {
    label: '刷新',
    command: () => location.reload()
  },
  {
    label: '粘贴',
    command: (e: Event) => handlePaste(e),
    visible: () => !!getFocusedEditableElement()
  }
]

export function generateMenu(e: MouseEvent) {
  e.preventDefault()

  currentEditableTarget = getFocusedEditableElement()

  document.querySelector('#custom-context-menu')?.remove()

  const menu = document.createElement('div')

  menu.id = 'custom-context-menu'

  menu.className = `
    bg-white dark:bg-black
    rounded-lg shadow-lg
    z-[9999]
    flex flex-col
    w-32
    border
    py-2
    overflow-hidden
    transition-all duration-150
    x-custom-ignore
  `

  for (const item of menus) {

    // 是否显示
    if (item.visible && !item.visible()) {
      continue
    }

    const span = document.createElement('span')

    span.className = `
      hover:bg-zinc-50 dark:hover:bg-zinc-800
      pl-3 pr-4 py-2
      border-b last:border-b-0
      cursor-pointer
      text-sm
      transition-colors duration-100
    `

    span.innerHTML = item.label

    span.onclick = async (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      await item.command()
      menu.remove()
    }

    menu.appendChild(span)
  }

  document.body.appendChild(menu)

  const menuWidth = menu.offsetWidth
  const menuHeight = menu.offsetHeight
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  let left = e.clientX
  let top = e.clientY

  if (left + menuWidth > windowWidth) {
    left = windowWidth - menuWidth
  }

  if (top + menuHeight > windowHeight) {
    top = windowHeight - menuHeight
  }

  menu.style.position = 'fixed'
  menu.style.left = `${left}px`
  menu.style.top = `${top}px`

  requestAnimationFrame(() => {
    document.addEventListener(
      'click',
      () => menu.remove(),
      { once: true }
    )
  })
}

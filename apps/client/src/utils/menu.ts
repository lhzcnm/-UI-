interface MenuType {
  label: string,
  commdand: () => void
}

const menus: MenuType[] = [
  {
    label: '全选',
    commdand: () => handleSelection()
  },
  {
    label: '刷新',
    commdand: () => location.reload()
  },
]

function handleSelection() {
  const selection = window.getSelection()
  const range = document.createRange()

  range.selectNodeContents(document.body)

  selection?.removeAllRanges()
  selection?.addRange(range)
}

export function generateMenu(e: MouseEvent) {
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
  `

  for(let item of menus) {
    const span = document.createElement('span')
    span.className = `
      hover:bg-zinc-50 dark:hover:bg-zinc-800
      pl-3 pr-4 py-2
      border-b last:border-b-0 cursor-pointer
      text-sm
      transition-colors duration-100
    `
    span.innerHTML = item.label
    span.onclick = () => {
      item.commdand()
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

  if(left + menuWidth > windowWidth) left = windowWidth - menuWidth
  if(top + menuHeight > windowHeight) top = windowHeight - menuHeight

  menu.style.position = 'fixed'
  menu.style.left = `${left}px`
  menu.style.top = `${top}px`

  document.addEventListener('click', () => menu.remove(), { once: true })
}

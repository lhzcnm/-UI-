import { createRouter, createWebHistory } from 'vue-router'

import notFound from './routes/404'
import auth     from './routes/auth'
import desktop  from './routes/desktop'
import mobile   from './routes/mobile'
import { ua } from '@3un/utils'
import { menus, tools, type SidebarMenuChild } from '@/utils'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    notFound,
    ...auth,
    ua.isMobile
      ? mobile
      : desktop,
  ],
})

router.beforeEach((to) => {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  const token = localStorage.getItem(key) || sessionStorage.getItem(key)

  // handle auth
  const isAuth = to.path.includes('auth')
  if (!isAuth && !token) return '/auth'
  if (isAuth && token) return '/dashboard'

  const isMobilePath = to.path.startsWith('/m')

  // is mobile and not mobile path
  if (ua.isMobile && !isMobilePath) {
    if (!token) return '/m/auth'
    return to.path.length > 1 ? `/m${to.path}` : '/m'
  }

  // is pc and is mobile path
  if (!ua.isMobile && isMobilePath) {
    if (!token) return '/auth'
    return to.path.replace('/m', '')
  }
})

// handle breadcrumb
router.afterEach((to) => {
  // only handle non auth route
  if (to.path.includes('auth')) return

  const store = useSystemStore()

  if (
    store.breadcrumbItems.length > 0 &&
    !store.isGlobalSearch
  ) return

  // extract breadcrumb info from route path
  let pathParts = to.path.split('/').filter(Boolean)
  if (ua.isMobile) pathParts = pathParts.slice(1)

  if (pathParts.length === 0) {
    store.breadcrumbItems = ['仪表盘']
    return
  }

  // find matching menu item by path
  const firstLevel = pathParts[0]
  let breadcrumbItems: string[] = []

  // find main menu by path
  const mainMenu = menus.concat(tools)
    .find(menu => menu.path === `/${firstLevel}`)

  if (mainMenu) {
    if (!mainMenu.children) {
      // no child menu or only one level path
      breadcrumbItems = [mainMenu.label]
    }
    else if (pathParts.length > 1) {
      // has child menu and has second level path
      const secondLevel = pathParts[1]
      const childMenu = mainMenu.children.find(child =>
        child.path === `/${firstLevel}/${secondLevel}`
      )

      breadcrumbItems = [mainMenu.label]
      if (childMenu) breadcrumbItems.push(childMenu.label)
    }
    else {
      // has child menu but second level path is query string
      breadcrumbItems = [mainMenu.label]
      const query = to.fullPath.split('?')[1]
      const params = new URLSearchParams(query)
      const match = params.get('q')

      let childMenu: SidebarMenuChild | undefined
      if (match) {
        childMenu = mainMenu.children.find(child => {
          return child.path === `/${firstLevel}?q=${match}`
        })
      }
      else {
        childMenu = mainMenu.children.find(child => {
          return child.path === `/${firstLevel}`
        })
      }

      if (childMenu) {
        breadcrumbItems.push(childMenu.label)
      }
    }
  } else {
    // no matching menu item, use path name as breadcrumb
    const firstChar = firstLevel.charAt(0).toUpperCase()
    const rest = firstLevel.slice(1)
    breadcrumbItems = [firstChar + rest]
  }

  store.breadcrumbItems = breadcrumbItems
})

export default router

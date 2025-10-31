import { createRouter, createWebHistory } from 'vue-router'

import desktop  from './routes/desktop'
import mobile   from './routes/mobile'
import other    from './routes/other'
import auth     from './routes/auth'
import notFound from './routes/404'

import { wxApi } from '@/api/wx'
import { ua } from '@3un/utils'

declare module 'vue-router' {
  interface RouteMeta {
    hideHeader?: boolean
    hideFooter?: boolean
    hideSidebar?: boolean
    noAuthRequired?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    auth, notFound,
    ua.isMobile
      ? mobile
      : desktop
    ,
    ...other,
  ],
})

router.beforeEach(async (to) => {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  const token = localStorage.getItem(key)

  const otherPaths = ['scan', 'service', 'orderDetail']
  const isOtherPath = otherPaths.some(p => to.path.includes(p))

  // handle wx auth
  const code = to.query.code as string
  if (ua.isWechat && code) {
    const iStore = useSettingStore()
    iStore.originUrl = window.location.href
    await handleWxAuthCallback(code)
    if (isOtherPath) return true
    return to.path
  }

  // handle other path
  if (isOtherPath) return true

  const isAuth = to.path.includes('auth')
  const isMobilePath = to.path.startsWith('/m')

  // is mobile and not mobile path and not auth
  if (ua.isMobile && !isMobilePath && !isAuth) {
    return to.path.length > 1 ? `/m${to.path}` : '/m'
  }

  if(!ua.isMobile && isMobilePath) {
    return to.path.replace('/m', '')
  }

  // handle auth
  if (!isAuth && !token && !to.meta.noAuthRequired) {
    return '/auth'
  }
  if (isAuth && token) return '/'
})

async function handleWxAuthCallback(code: string) {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  const { data } = await wxApi.accessToken(code)
  localStorage.setItem(key, data)
}

export default router

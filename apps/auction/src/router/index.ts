import { ua } from '@3un/utils'
import { createRouter, createWebHistory } from 'vue-router'

import { desktop } from './desktop'
import { mobile } from './mobile'

const routes = [
  ...(ua.isDesktop ? desktop : mobile )
]

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
})

export default router

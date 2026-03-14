import { createRouter, createWebHashHistory } from 'vue-router'

import guide from './routes/desktop'
import { getDeviceType } from '@/utils/ua'
import guideMobile from './routes/mobile'

const REST_ROUTES = getDeviceType() ? guideMobile : guide
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...REST_ROUTES
  ],

})

export default router


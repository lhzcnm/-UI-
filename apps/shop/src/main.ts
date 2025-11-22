import { createPinia } from 'pinia'

import App from "./App.vue"
import i18n from './locales'
import router from "./router"

import "./assets/index.css"

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(i18n)

app.mount('#app')

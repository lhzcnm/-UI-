import './assets/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './locales'

const app = createApp(App)
const pinia = createPinia()


app.use(router)
app.use(pinia)
app.use(i18n)

const localeStore = useLocalStore()
localeStore.getLocalData()

app.mount('#app')

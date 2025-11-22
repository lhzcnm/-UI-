import { createI18n } from "vue-i18n"
import messages from "@intlify/unplugin-vue-i18n/messages"

let locale = localStorage.getItem('locale')

if(!locale) {
  locale = navigator.language.startsWith('zh') ? 'zh' : 'en'
}

const i18n = createI18n({
  locale,
  messages: messages,
})

export default i18n

import router from './router'
import store from './store'
import { createApp } from 'vue'

import App from './app.vue'
import ToastCloseButton from '@/components/toast/toast-close-button.vue'

import { createVfm } from 'vue-final-modal'
import PrimeVue from 'primevue/config'
import Toast from 'vue-toastification'

import 'primevue/resources/themes/aura-dark-purple/theme.css'
import 'vue-toastification/dist/index.css'
import 'vue-final-modal/style.css'
import '@/styles/main.scss'

const app = createApp(App)
const vfm = createVfm()

app
  .use(store)
  .use(router)
  .use(vfm)
  .use(PrimeVue)
  .use(Toast, {
    toastClassName: 'tw-column-start tw-py-4 tw-px-6 tw-rounded tw-bg-ink/darker tw-relative tw-w-[420px] tw-shadow-none',
    containerClassName: 'toast_container',
    bodyClassName: 'tw-flex',
    hideProgressBar: true,
    icon: false,
    timeout: 3000,
    closeButton: ToastCloseButton,
    closeOnClick: false,
    draggable: false
  })
  .mount('#app')

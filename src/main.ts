import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    }
  }
});

import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

app.use(Vue3Toastify, {
  autoClose: 3000,
} as ToastContainerOptions);

app.use(createPinia());
app.use(router);
app.use(vuetify);
app.use(VCalendar, {});

app.mount('#app')

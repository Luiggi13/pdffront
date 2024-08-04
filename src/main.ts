import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export async function setupApp() {
  const app = createApp(App).use(createPinia().use(piniaPluginPersistedstate)).use(router);
  app.mount('#app');
  return app;
}

setupApp();

import { createApp } from 'vue';
import router from './router.ts';
import vuetify from './vuetify-plugin.ts';

// import ToggleButton from 'vue-js-toggle-button';
import App from './app.vue';

import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.css';

// Vue.use(ToggleButton);

const app = createApp(App)
    .use(router)
    .use(vuetify);
app.mount('#app');

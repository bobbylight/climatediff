import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import ToggleButton from 'vue-js-toggle-button';
import App from './app.vue';
import MainPage from './main-page.vue';
import About from './about.vue';

import '../../node_modules/vuetify/dist/vuetify.min.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.less';

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(ToggleButton);

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/compare' },
        { name: 'compare', path: '/compare/:city1?/:city2?', component: MainPage },
        { name: 'about', path: '/about', component: About }
    ]
});

new Vue({
    el: '#app',
    router: router,
    components: {
        App
    }
});

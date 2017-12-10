import 'bootstrap/js/modal';
import 'bootstrap-3-typeahead';

import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import ToggleButton from 'vue-js-toggle-button';
import App from './app.vue';
import MainPage from './main-page.vue';

// TODO: Remove bootstrap dependencies
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/vuetify/dist/vuetify.min.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.less';
import '../../node_modules/typeahead.js-bootstrap-css/typeaheadjs.css';

Vue.use(VueRouter);
Vue.use(Vuetify);
Vue.use(ToggleButton);

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/compare' },
        { name: 'compare', path: '/compare/:city1?/:city2?', component: MainPage }
    ]
});

new Vue({
    el: '#app',
    router: router,
    components: {
        App
    }
});

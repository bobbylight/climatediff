import 'bootstrap/js/modal';
import 'bootstrap-3-typeahead';

import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from './main.vue';
import MainPage from 'main-page.vue';

import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.less';
import '../../node_modules/typeahead.js-bootstrap-css/typeaheadjs.css';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/compare' },
        { name: 'compare', path: '/compare/:city1?/:city2?', component: MainPage }
    ]
});

new Vue({
    el: '#app',
    router: router,
    render: (h) => {
        return h(Main);
    }
});

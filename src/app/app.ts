import Component from 'vue-class-component';

// Allows vue-class-component classes to resolve hooks provided by vue-router
Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteLeave',
    'beforeRouteUpdate'
]);

import Vue from 'vue';
import VueRouter from 'vue-router';

import Vuetify from 'vuetify/es5/components/Vuetify';
import VAlert from 'vuetify/es5/components/VAlert';
import VAutocomplete from 'vuetify/es5/components/VAutocomplete';
import VApp from 'vuetify/es5/components/VApp';
import VBtn from 'vuetify/es5/components/VBtn';
import VCard from 'vuetify/es5/components/VCard';
import VFooter from 'vuetify/es5/components/VFooter';
import VGrid from 'vuetify/es5/components/VGrid'; // VContainer, VContent, VFlex, VGrid, VLayout, VSpacer
import VIcon from 'vuetify/es5/components/VIcon';
import VProgressCircular from 'vuetify/es5/components/VProgressCircular';
import VToolbar from 'vuetify/es5/components/VToolbar';
import transitions from 'vuetify/es5/components/transitions';

import ToggleButton from 'vue-js-toggle-button';
import App from './app.vue';
import MainPage from './main-page.vue';
import About from './about.vue';

import '../../node_modules/vuetify/dist/vuetify.min.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.less';

Vue.use(VueRouter);
Vue.use(Vuetify, {
    components: {
        VAlert,
        VApp,
        VAutocomplete,
        VBtn,
        VCard,
        VFooter,
        VGrid,
        VIcon,
        VProgressCircular,
        VToolbar,
        transitions
    }
});
Vue.use(ToggleButton);

const router: VueRouter = new VueRouter({
    routes: [
        { name: 'start', path: '/', redirect: '/compare' },
        { name: 'compare', path: '/compare/:city1?/:city2?', component: MainPage },
        { name: 'about', path: '/about', component: About }
    ]
});

new Vue({
    el: '#app',
    router: router,
    render: (h) => {
        return h(App);
    }
});

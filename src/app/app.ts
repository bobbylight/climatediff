import Vue from 'vue';
import VueRouter from 'vue-router';

// import Vuetify from 'vuetify';
import Vuetify from 'vuetify/es5/components/Vuetify';
import VAlert from 'vuetify/es5/components/VAlert';
import VApp from 'vuetify/es5/components/VApp';
import VBtn from 'vuetify/es5/components/VBtn';
import VCard from 'vuetify/es5/components/VCard';
import VContainer from 'vuetify/es5/components/VGrid';
import VContent from 'vuetify/es5/components/VGrid';
import VFlex from 'vuetify/es5/components/VGrid';
import VFooter from 'vuetify/es5/components/VFooter';
import VIcon from 'vuetify/es5/components/VIcon';
import VLayout from 'vuetify/es5/components/VGrid';
import VProgressCircular from 'vuetify/es5/components/VProgressCircular';
import VProgressLinear from 'vuetify/es5/components/VProgressLinear';
import VSelect from 'vuetify/es5/components/VSelect';
import VSpacer from 'vuetify/es5/components/VGrid';
import VToolbar from 'vuetify/es5/components/VToolbar';
import transitions from 'vuetify/es5/components/transitions';

import ToggleButton from 'vue-js-toggle-button';
import App from './app.vue';
import MainPage from './main-page.vue';
import About from './about.vue';

import '../../node_modules/vuetify/dist/vuetify.min.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.less';

/* tslint:disable:no-unsafe-any */
Vue.use(VueRouter);
// Vue.use(Vuetify);
Vue.use(Vuetify, {
    components: {
        VAlert,
        VApp,
        VBtn,
        VCard,
        VContainer,
        VContent,
        VFlex,
        VFooter,
        VIcon,
        VLayout,
        VProgressCircular,
        VProgressLinear,
        VSpacer,
        VSelect,
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

// tslint:disable-next-line:no-unused-expression
new Vue({
    el: '#app',
    router: router,
    components: {
        App
    }
});

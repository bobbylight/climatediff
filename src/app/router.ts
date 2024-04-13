import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import MainPage from './main-page.vue';

const routes: readonly RouteRecordRaw[] = [
    { name: 'start', path: '/', redirect: '/compare' },
    { name: 'compare', path: '/compare/:city1?/:city2?', component: MainPage },
    { name: 'about', path: '/about', component: () => import('./about.vue') },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;

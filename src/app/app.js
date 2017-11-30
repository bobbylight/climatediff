import 'bootstrap';

import Vue from 'vue';
import Main from './main.vue';

import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.less';

new Vue({
    el: '#app',
    render: (h) => {
        return h(Main);
    }
});

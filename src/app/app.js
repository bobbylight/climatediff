import 'angular';
import 'angular-ui-bootstrap';
import 'angular-spinner';
import 'angular-ui-router';
import 'bootstrap';

import MainPageController from './main-page.controller';
import { UtilService } from './utils.service';
import BannerDirective from './banner.directive';
import ChartDirective from './chart.directive';
import MonthService from './month.service';

import Vue from 'vue';
import Vueapp from './Vueapp.vue';

import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.less';

const app = angular.module('cdApp',
    [ 'ui.bootstrap', 'angularSpinner', 'ui.router' ]);

app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider, $urlRouterProvider) => {
    'use strict';

    $stateProvider.state('main', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller:  'MainPageCtrl as vm'
    });

    $urlRouterProvider.otherwise('/');
}])
    .controller('MainPageCtrl', MainPageController)
    .service('Utils', UtilService)
    .service('Months', MonthService)
    .directive('cdBanner', BannerDirective)
    .directive('cdChart', ChartDirective);

new Vue({
    el: '#app',
    render: (h) => {
        return h(Vueapp);
    }
});

export default app;

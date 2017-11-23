import 'angular';
import 'angular-ui-bootstrap';
import 'angular-spinner';
import 'angular-ui-router';
import 'bootstrap';

import MainPageController from './main-page.controller';
import { UtilService } from './utils.service';
import BannerDirective from './banner.directive';
import AboutDialogDirective from './about-dialog.directive';
import ChartDirective from './chart.directive';
import MonthService from './month.service';

import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/font-awesome/css/font-awesome.css';
import '../css/app.less';

const app: ng.IModule = angular.module('cdApp',
    [ 'ui.bootstrap', 'angularSpinner', 'ui.router' ]);

app.config(['$stateProvider', '$urlRouterProvider', ($stateProvider: ng.ui.IStateProvider,
                                                     $urlRouterProvider: ng.ui.IUrlRouterProvider) => {
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
    .directive('cdAbout', AboutDialogDirective)
    .directive('cdChart', ChartDirective);

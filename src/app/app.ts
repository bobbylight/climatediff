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
}]);

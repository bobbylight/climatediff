const app: ng.IModule = angular.module('cdApp',
    [ 'ui.bootstrap', 'angularSpinner', 'ui.router' ]);

app.config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    'use strict';

    $stateProvider.state('main', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller:  'MainPageCtrl as vm'
    });

}]);

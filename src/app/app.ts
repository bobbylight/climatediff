var app = angular.module('cdApp',
    [ 'angularSpinner', 'ui.router' ]);

app.config(['$stateProvider', ($stateProvider: ng.ui.IStateProvider) => {
    'use strict';

    $stateProvider.state('main', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller:  'MainPageCtrl as vm'
    });

}]);

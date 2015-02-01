var climatediff = angular.module('cdApp',
   [ 'ui.bootstrap', 'angularSpinner', 'cdControllers', 'cdDirectives' ]);
   //[ 'gcControllers', 'gcDirectives', 'gcServices', 'pasvaz.bindonce' ]);

climatediff.config(['$routeProvider', function($routeProvider) {
   'use strict';
   
   $routeProvider.when('/', {
      templateUrl: 'partials/main.html',
      controller:  'MainPageCtrl'
   }).
   when('/about', {
      templateUrl: 'partials/about.html',
      controller: 'AboutCtrl'
   });
   
}]);

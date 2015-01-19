var controllers = angular.module('cdControllers', ['ngRoute', 'ngResource']);

controllers.controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
   'use strict';
   
   $scope.city1 = 'Raleigh, NC';
   $scope.city2 = 'Philadelphia, PA';
   
   $scope.getLocationCompletions = function(val) {
      return $http.get('api/locations', {
         params: {
            input: val,
            limit: 10
         }
      }).then(function(response) {
         console.log(JSON.stringify(response));
         return response.data.map(function(item) {
            return item.city_name;
         });
      });
/*
 * Google API example, cool but does not match our service's addresses.
      return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
         params: {
            address: val,
            sensor: false
         }
      }).then(function(response) {
         return response.data.results.map(function(item) {
            return item.formatted_address;
         });
      });
*/
   };
   
   $scope.updateClimateDiff = function() {
         $scope.resultsLoaded = true;
      $scope.resultsLabel = 'Comparing ' + $scope.city1 + ' to ' + $scope.city2 + ':';
      // TODO: Fetch 'data' from service, directive has a watch on it
      return $http.get('api/climatediff/' + $scope.city1 + '/' + $scope.city2)
         .then(function(response) {
            console.log(JSON.stringify(response));
            $scope.data = response.data;
         });
   };
   
}]);

controllers.controller('MenuCtrl', ['$scope', '$location', function($scope, $location) {
   'use strict';
   
   $scope.routeIs = function(routeName) {
      return $location.path() === routeName;
   };
   
}]);

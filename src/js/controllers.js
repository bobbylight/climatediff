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
   
   function celsiusToFahrenheit(data) {
      function cToF(c) {
         return c * (9/5) + 32;
      }
      return data.map(function(elem) {
         elem.city1.min = cToF(elem.city1.min);
         elem.city1.median = cToF(elem.city1.median);
         elem.city1.max = cToF(elem.city1.max);
         elem.city2.min = cToF(elem.city2.min);
         elem.city2.median = cToF(elem.city2.median);
         elem.city2.max = cToF(elem.city2.max);
         return elem;
      });
   }
   
   $scope.updateClimateDiff = function() {
      $scope.resultsLoaded = true;
      
      $scope.maskResults = true;
//      $scope.startSpin();
      
      $scope.resultsLabel = 'Comparing ' + $scope.city1 + ' to ' + $scope.city2 + ':';
      // Mimic an empty data set to clear out previous graphs
      $scope.data = { data: [],
            metadata: [ { 'city_name': $scope.city1 }, { 'city_name': $scope.city2 } ] };
      
      return $http.get('api/climatediff/' + $scope.city1 + '/' + $scope.city2)
         .success(function(data, status, headers, config) {
            console.log(JSON.stringify(data));
            data.data = celsiusToFahrenheit(data.data);
            $scope.data = data;
//            $scope.stopSpin();
            $scope.maskResults = false;
         })
         .error(function(data, status, headers, config) {
            alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
//            $scope.stopSpin();
            $scope.maskResults = false;
         });
   };
   
}]);

controllers.controller('MenuCtrl', ['$scope', '$location', function($scope, $location) {
   'use strict';
   
   $scope.routeIs = function(routeName) {
      return $location.path() === routeName;
   };
   
}]);

var controllers = angular.module('cdControllers', ['ngRoute', 'ngResource', 'cdServices']);

controllers.controller('MainCtrl', ['$scope', function($scope) {
   'use strict';
}]);

controllers.controller('MainPageCtrl', ['$scope', '$http', 'Utils', function($scope, $http, Utils) {
   'use strict';
   
   $scope.city1 = 'Raleigh, NC US';
   $scope.city2 = 'Lexington, KY US';
   $scope.typeaheadWaitMillis = 500;
   
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
      return data.map(function(elem) {
         if (elem.city1) {
            elem.city1.min = Utils.celsiusToFahrenheit(elem.city1.min);
            elem.city1.median = Utils.celsiusToFahrenheit(elem.city1.median);
            elem.city1.max = Utils.celsiusToFahrenheit(elem.city1.max);
         }
         if (elem.city2) {
            elem.city2.min = Utils.celsiusToFahrenheit(elem.city2.min);
            elem.city2.median = Utils.celsiusToFahrenheit(elem.city2.median);
            elem.city2.max = Utils.celsiusToFahrenheit(elem.city2.max);
         }
         return elem;
      });
   }
   
   function fahrenheitToCelsius(data) {
      return data.map(function(elem) {
         if (elem.city1) {
            elem.city1.min = Utils.fahrenheitToCelsius(elem.city1.min);
            elem.city1.median = Utils.fahrenheitToCelsius(elem.city1.median);
            elem.city1.max = Utils.fahrenheitToCelsius(elem.city1.max);
         }
         if (elem.city2) {
            elem.city2.min = Utils.fahrenheitToCelsius(elem.city2.min);
            elem.city2.median = Utils.fahrenheitToCelsius(elem.city2.median);
            elem.city2.max = Utils.fahrenheitToCelsius(elem.city2.max);
         }
         return elem;
      });
   }
   
   $scope.setUnits = function(units) {
      console.log(' --- ' + units);
      var temp = $scope.tempData.data;
      if (units === 'fahrenheit') {
         temp = celsiusToFahrenheit(temp);
      }
      else if (units === 'celsius') {
         temp = fahrenheitToCelsius(temp);
      }
      $scope.tempData.data = temp;
   };
   
   $scope.updateClimateDiff = function() {
      
      $scope.showCharts = true;
      $scope.maskTempResults = true;
      $scope.maskPrecipResults = true;
      
      $scope.resultsTitle = 'Comparing ' + $scope.city1 + ' to ' + $scope.city2 + ':';
      
      // Mimic an empty data set to clear out previous graphs
      $scope.tempData = { data: [],
            metadata: [ { 'city_name': $scope.city1 }, { 'city_name': $scope.city2 } ] };
      $scope.precipData = { data: [],
            metadata: [ { 'city_name': $scope.city1 }, { 'city_name': $scope.city2 } ] };
      
      function updatePrecipChart() {
         return $http.get('api/precipitation/' + $scope.city1 + '/' + $scope.city2)
            .success(function(data, status, headers, config) {
               console.log(JSON.stringify(data));
               //data.data = celsiusToFahrenheit(data.data);
               $scope.precipData = data;
               $scope.maskPrecipResults = false;
            })
            .error(function(data, status, headers, config) {
               alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
               $scope.maskPrecipResults = false;
            });
      }
      
      return $http.get('api/temperature/' + $scope.city1 + '/' + $scope.city2)
         .success(function(data, status, headers, config) {
            console.log(JSON.stringify(data));
            data.data = celsiusToFahrenheit(data.data);
            $scope.tempData = data;
            $scope.maskTempResults = false;
            updatePrecipChart();
         })
         .error(function(data, status, headers, config) {
            alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
            $scope.maskTempResults = false;
            updatePrecipChart();
         });
   };
   
}]);

controllers.controller('MenuCtrl', ['$scope', '$location', function($scope, $location) {
   'use strict';
   
   $scope.routeIs = function(routeName) {
      return $location.path() === routeName;
   };
   
}]);

controllers.controller('AboutCtrl', ['$scope', function($scope) {
   'use strict';

}]);

var services = angular.module('cdServices', []);

services.service('Utils', function() {
   'use strict';
   
   this.celsiusToFahrenheit = function(c) {
      return c * (9/5) + 32;
   };
   
   this.fahrenheitToCelsius = function(f) {
      return (f - 32) * (5/9);
   };
   
});

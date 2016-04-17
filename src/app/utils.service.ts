module climatediff {
    'use strict';

    export class UtilService {

        celsiusToFahrenheit(c: number): number {
            return c * (9/5) + 32;
        }

        fahrenheitToCelsius(f: number): number {
            return (f - 32) * (5/9);
        }
    }
}

angular.module('cdApp').service('Utils', climatediff.UtilService);
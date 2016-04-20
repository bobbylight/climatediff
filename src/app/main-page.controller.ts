module climatediff {
    'use strict';

    export class MainPageController {

        city1: string;
        city2: string;
        typeaheadWaitMillis: number;
        tempChartConfig: any;
        precipChartConfig: any;
        showCharts: boolean;
        maskTempResults: boolean;
        maskPrecipResults: boolean;
        resultsTitle: string;
        tempData: any;
        precipData: any;

        static $inject: string[] = [ '$scope', '$http', '$timeout', 'Utils' ];

        constructor(private $scope: ng.IScope, private $http: ng.IHttpService, private $timeout: ng.ITimeoutService, private Utils: climatediff.UtilService) {

            this.city1 = 'Raleigh, NC US';
            this.city2 = 'Lexington, KY US';
            this.typeaheadWaitMillis = 500;

            this.tempChartConfig = {
                unit: '\u00b0 F'
            };
            this.precipChartConfig = {
                unit: '"'
            };
        }

        private celsiusToFahrenheit(data: any) {
            return data.map((elem: any) => {
                if (elem.city1) {
                    elem.city1.min = this.Utils.celsiusToFahrenheit(elem.city1.min);
                    elem.city1.median = this.Utils.celsiusToFahrenheit(elem.city1.median);
                    elem.city1.max = this.Utils.celsiusToFahrenheit(elem.city1.max);
                }
                if (elem.city2) {
                    elem.city2.min = this.Utils.celsiusToFahrenheit(elem.city2.min);
                    elem.city2.median = this.Utils.celsiusToFahrenheit(elem.city2.median);
                    elem.city2.max = this.Utils.celsiusToFahrenheit(elem.city2.max);
                }
                return elem;
            });
        }

        private fahrenheitToCelsius(data: any) {
            return data.map((elem: any) => {
                if (elem.city1) {
                    elem.city1.min = this.Utils.fahrenheitToCelsius(elem.city1.min);
                    elem.city1.median = this.Utils.fahrenheitToCelsius(elem.city1.median);
                    elem.city1.max = this.Utils.fahrenheitToCelsius(elem.city1.max);
                }
                if (elem.city2) {
                    elem.city2.min = this.Utils.fahrenheitToCelsius(elem.city2.min);
                    elem.city2.median = this.Utils.fahrenheitToCelsius(elem.city2.median);
                    elem.city2.max = this.Utils.fahrenheitToCelsius(elem.city2.max);
                }
                return elem;
            });
        }

        getLocationCompletions(val: any) {
            return this.$http.get('api/locations', {
                params: {
                    input: val,
                    limit: 10
                }
            }).then(function(response: any) {
                console.log(JSON.stringify(response));
                return response.data.map(function(item: any) {
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
        }

        setUnits(units: string) {
            console.log(' --- ' + units);
            var temp: any = this.tempData.data;
            if (units === 'fahrenheit') {
                temp = this.celsiusToFahrenheit(temp);
            }
            else if (units === 'celsius') {
                temp = this.fahrenheitToCelsius(temp);
            }
            this.tempData.data = temp;
        }

        updateClimateDiff() {

            this.showCharts = true;
            this.maskTempResults = true;
            this.maskPrecipResults = true;

            this.resultsTitle = 'Comparing ' + this.city1 + ' to ' + this.city2 + ':';

            // Mimic an empty data set to clear out previous graphs
            this.tempData = { data: [],
                metadata: [ { 'city_name': this.city1 }, { 'city_name': this.city2 } ] };
            this.precipData = { data: [],
                metadata: [ { 'city_name': this.city1 }, { 'city_name': this.city2 } ] };

            const updatePrecipChart: Function = () => {
                return this.$http.get('api/precipitation/' + this.city1 + '/' + this.city2)
                    .success((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                        console.log(JSON.stringify(data));
                        //data.data = celsiusToFahrenheit(data.data);
                        this.maskPrecipResults = false;
                        this.$timeout(() => { this.precipData = data; }, 0);
                    })
                    .error(function(data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) {
                        alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
                        this.maskPrecipResults = false;
                    });
            };

            return this.$http.get('api/temperature/' + this.city1 + '/' + this.city2)
                .success((data: climatediff.TemperatureResponse, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                    data.data = this.celsiusToFahrenheit(data.data);
                    // this.tempMetadata = data.metadata;
                    // this.tempData = data.data;
                    this.maskTempResults = false;
                    this.$timeout(() => { this.tempData = data; }, 0);
                    updatePrecipChart();
                })
                .error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                    alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
                    this.maskTempResults = false;
                    updatePrecipChart();
                });
        }
    }
}

angular.module('cdApp').controller('MainPageCtrl', climatediff.MainPageController);

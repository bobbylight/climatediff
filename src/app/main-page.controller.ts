module climatediff {
    'use strict';

    export class MainPageController {

        city1: string;
        city2: string;
        typeaheadWaitMillis: number;
        tempChartConfig: ChartConfig;
        precipChartConfig: ChartConfig;
        showCharts: boolean;
        maskTempResults: boolean;
        maskPrecipResults: boolean;
        resultsTitle: string;
        tempData: any;
        precipData: any;

        static $inject: string[] = [ '$scope', '$http', '$timeout', '$log', 'Utils' ];

        constructor($scope: ng.IScope, private $http: ng.IHttpService, private $timeout: ng.ITimeoutService,
                    private $log: ng.ILogService, private Utils: UtilService) {

            this.city1 = 'Raleigh, NC US';
            this.city2 = 'Lexington, KY US';
            this.typeaheadWaitMillis = 500;

            this.tempChartConfig = {
                units: [
                    { axisSuffix: '\u00b0 F', label: '\u00b0 F', convert: this.celsiusToFahrenheit },
                    { axisSuffix: '\u00b0 C', label: '\u00b0 C', convert: this.fahrenheitToCelsius }
                ]
            };
            this.precipChartConfig = {
                units: [
                    { axisSuffix: '"', label: 'in', convert: angular.identity },
                    { axisSuffix: 'cm', label: 'cm', convert: angular.identity }
                ]
            };
        }

        private celsiusToFahrenheit(data: MonthRecord[]): MonthRecord[] {
            return data.map((elem: MonthRecord) => {
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

        private fahrenheitToCelsius(data: MonthRecord[]): MonthRecord[] {
            return data.map((elem: MonthRecord) => {
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
            }).then((response: ng.IHttpResponse<any>) => {
                this.$log.log(JSON.stringify(response));
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

        setUnits(unitConfig: UnitConfig) {
            // NOTE: This assumes exactly 2 unit choices, not > 2
            this.tempData.data = unitConfig.convert.call(this, this.tempData.data);
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
                    .then((result: ng.IHttpResponse<any>) => {
                        this.$log.log(JSON.stringify(result.data));
                        //result.data.data = celsiusToFahrenheit(result.data.data);
                        this.maskPrecipResults = false;
                        this.$timeout(() => { this.precipData = result.data; }, 0);
                    })
                    .catch((result: ng.IHttpResponse<any>) => {
                        alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
                        this.maskPrecipResults = false;
                    });
            };

            return this.$http.get('api/temperature/' + this.city1 + '/' + this.city2)
                .then((result: ng.IHttpResponse<any>) => {
                    result.data.data = this.celsiusToFahrenheit(result.data.data);
                    // this.tempMetadata = data.metadata;
                    // this.tempData = data.data;
                    this.maskTempResults = false;
                    this.$timeout(() => { this.tempData = result.data; }, 0);
                    updatePrecipChart();
                })
                .catch((result: ng.IHttpResponse<any>) => {
                    alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
                    this.maskTempResults = false;
                    updatePrecipChart();
                });
        }
    }
}

angular.module('cdApp').controller('MainPageCtrl', climatediff.MainPageController);

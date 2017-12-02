import { /*ChartConfig, */ MonthRecord, UnitConfig } from './climatediff';
import Utils from './Utils';
import jqXHR = JQuery.jqXHR;
import Chart from './chart.vue';
import Typeahead from './typeahead.vue';

export default {

    components: {
        Chart,
        Typeahead
    },

    data: function() {
        return {
            city1: null,
            city2: null,
            typeaheadWaitMillis: 500,
            tempChartConfig: null, // ChartConfig
            precipChartConfig: null, // ChartConfig
            showCharts: false,
            maskTempResults: false,
            maskPrecipResults: false,
            resultsTitle: null,
            tempData: null,
            precipData: null,
            locationQueryParams: {
                limit: 10
            }
        };
    },

    created() {

        this.city1 = 'Raleigh, NC US';
        this.city2 = 'Lexington, KY US';
        this.typeaheadWaitMillis = 500;

        this.tempChartConfig = {
            units: [
                {axisSuffix: '\u00b0 F', label: '\u00b0 F', convert: this.celsiusToFahrenheit},
                {axisSuffix: '\u00b0 C', label: '\u00b0 C', convert: this.fahrenheitToCelsius}
            ]
        };
        const identity: (data: any) => any = (data: any) => {
            return data;
        };
        this.precipChartConfig = {
            units: [
                {axisSuffix: '"', label: 'in', convert: identity},
                {axisSuffix: 'cm', label: 'cm', convert: identity}
            ]
        };
    },

    methods: {

        celsiusToFahrenheit(data: MonthRecord[]): MonthRecord[] {
            return data.map((elem: MonthRecord) => {
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
        },

        fahrenheitToCelsius(data: MonthRecord[]): MonthRecord[] {
            return data.map((elem: MonthRecord) => {
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
        },

        getLocationCompletions(val: any) {
            $.get('api/locations',
                {
                    input: val,
                    limit: 10
                },
                (response: any) => {
                    console.log(JSON.stringify(response));
                    return response.map(function (item: any) {
                        return item.city_name;
                    });
                }
            );
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
        },

        locationMapper: (record: any) => {
            return {
                id: record.city_id,
                name: record.city_name
            };
        },

        setUnits(unitConfig: UnitConfig) {
            // NOTE: This assumes exactly 2 unit choices, not > 2
            this.tempData.data = unitConfig.convert.call(this, this.tempData.data);
        },

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
                return $.ajax('api/precipitation/' + this.city1 + '/' + this.city2,
                    {
                        success: (result: any) => {
                            console.log(JSON.stringify(result));
                            //result.data.data = celsiusToFahrenheit(result.data.data);
                            this.maskPrecipResults = false;
                            setTimeout(() => {
                                this.precipData = result;
                            }, 0);
                        },
                        error: (result: jqXHR) => {
                            alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
                            this.maskPrecipResults = false;
                        }
                    }
                );
            };

            return $.ajax('api/temperature/' + this.city1 + '/' + this.city2,
                {
                    success: (result: any) => {
                        result.data = this.celsiusToFahrenheit(result.data);
                        // this.tempMetadata = data.metadata;
                        // this.tempData = data.data;
                        this.maskTempResults = false;
                        setTimeout(() => {
                            this.tempData = result;
                        }, 0);
                        updatePrecipChart();
                    },
                    error: (result: jqXHR) => {
                        alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
                        this.maskTempResults = false;
                        updatePrecipChart();
                    }
                }
            );
        }
    }
};

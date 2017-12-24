import { CityTemperatureInfo, /*ChartConfig, */ TemperatureResponse, UnitConfig } from './climatediff';
import Utils from './utils';
import Chart from './chart/chart.vue';
import CityForm from './city-form.vue';
import Ajax from './ajax';
import { Route } from 'vue-router';

const TYPEAHEAD_WAIT_MILLIS: number = 500;

export default {

    components: {
        CityForm,
        Chart
    },

    data: function() {
        return {
            city1: null,
            city2: null,
            tempChartConfig: null, // ChartConfig
            precipChartConfig: null, // ChartConfig
            showCharts: false,
            maskTempResults: false,
            maskPrecipResults: false,
            resultsTitle: null,
            tempData: null, // TemperatureResponse
            precipData: null // TemperatureResponse
        };
    },

    /**
     * Called when the component is first created.
     */
    created() {

        this.setCitiesFromRoute(this.$route);
        this.typeaheadWaitMillis = TYPEAHEAD_WAIT_MILLIS;

        this.tempChartConfig = {
            units: [
                { axisSuffix: '\u00b0 F', label: '\u00b0 F', convert: this.celsiusToFahrenheit },
                { axisSuffix: '\u00b0 C', label: '\u00b0 C', convert: this.fahrenheitToCelsius }
            ]
        };
        const identity: (data: any) => any = (data: any) => {
            return data;
        };
        this.precipChartConfig = {
            units: [
                { axisSuffix: '"', label: 'in', convert: identity },
                { axisSuffix: 'cm', label: 'cm', convert: identity }
            ]
        };
    },

    /**
     * Called when the route changes.  Update the UI to reflect our new cities.
     *
     * @param {Route} to The route we're going to.
     * @param {Route} from The route we're coming from.
     * @param next Callback.
     */
    beforeRouteUpdate(to: Route, from: Route, next: Function) {
        this.setCitiesFromRoute(to);
        next();
    },

    /**
     * Called when the component is initially displayed.
     */
    beforeMount() {
        // If cities were initially passed in, go ahead and run the comparison.
        if (this.$route.params.city1 && this.$route.params.city2) {
            const city1: string = Utils.cityRouteFormToReadableForm(this.$route.params.city1);
            const city2: string = Utils.cityRouteFormToReadableForm(this.$route.params.city2);
            this.updateClimateDiff(city1, city2);
        }
    },

    methods: {

        celsiusToFahrenheit(data: CityTemperatureInfo[]): CityTemperatureInfo[] {
            return data.map((elem: CityTemperatureInfo) => {
                // Ensure 'min' is defined as empty city objects can be sent down on error
                if (elem && typeof elem.min === 'number') {
                    elem.min = Utils.celsiusToFahrenheit(elem.min);
                    elem.median = Utils.celsiusToFahrenheit(elem.median);
                    elem.max = Utils.celsiusToFahrenheit(elem.max);
                }
                return elem;
            });
        },

        fahrenheitToCelsius(data: CityTemperatureInfo[]): CityTemperatureInfo[] {
            return data.map((elem: CityTemperatureInfo) => {
                // Ensure 'min' is defined as empty city objects can be sent down on error
                if (elem && typeof elem.min === 'number') {
                    elem.min = Utils.fahrenheitToCelsius(elem.min);
                    elem.median = Utils.fahrenheitToCelsius(elem.median);
                    elem.max = Utils.fahrenheitToCelsius(elem.max);
                }
                return elem;
            });
        },

        setCitiesFromRoute(route: Route) {

            const prevCity1: string = this.city1;
            const prevCity2: string = this.city2;

            this.city1 = Utils.cityRouteFormToReadableForm(route.params.city1 || 'Raleigh, NC US');
            this.city2 = Utils.cityRouteFormToReadableForm(
                route.params.city2 || (route.params.city1 ? '' : 'Lexington, KY US'));

            if (!route.params.city1 || this.city1 !== prevCity1 || this.city2 !== prevCity2) {
                this.showCharts = false;
            }
        },

        setUnits(unitConfig: UnitConfig) {
            // NOTE: This assumes exactly 2 unit choices, not > 2
            this.tempData.data = unitConfig.convert.call(this, this.tempData.data);
        },

        updateClimateDiff(city1: string, city2: string) {

            this.$router.push({ name: 'compare', params: {
                    city1: Utils.cityReadableFormToRouteForm(city1),
                    city2: Utils.cityReadableFormToRouteForm(city2)
                }
            });

            // Route params seem to be auto-bound to properties here?  So set our cities last to avoid '_'s in them.
            this.city1 = city1;
            this.city2 = city2;
            this.showCharts = true;
            this.maskTempResults = true;
            this.maskPrecipResults = true;

            this.resultsTitle = `Comparing ${this.city1} to ${this.city2}:`;

            // Mimic an empty data set to clear out previous graphs
            this.tempData = { data: [],
                metadata: [ { 'city_name': this.city1 }, { 'city_name': this.city2 } ] };
            this.precipData = { data: [],
                metadata: [ { 'city_name': this.city1 }, { 'city_name': this.city2 } ] };

            let urlCityArgs: string = `${this.city1}`;
            if (this.city2) {
                urlCityArgs += `/${this.city2}`;
            }

            const updatePrecipChart: Function = () => {

                const precipSuccess: Function = (responseData: any) => {
                    console.log(JSON.stringify(responseData));
                    // result.data.data = celsiusToFahrenheit(result.data.data);
                    this.maskPrecipResults = false;
                    this.precipData = responseData;
                };
                const precipFailure: Function = () => {
                    alert('An error occurred fetching precipitation data!');
                    this.maskPrecipResults = false;
                };

                Ajax.get(`api/precipitation/${urlCityArgs}`, null, precipSuccess, precipFailure);
            };

            const tempSuccess: Function = (responseData: TemperatureResponse) => {
                // We must clone the response data since it is read-only and we want to mutate it
                const data: TemperatureResponse = {
                    city1: {
                        data: this.celsiusToFahrenheit(responseData.city1.data),
                        metadata: responseData.city1.metadata,
                        debug: responseData.city1.debug,
                        errors: responseData.city1.errors,
                        queries: responseData.city1.queries
                    }
                };
                if (responseData.city2) {
                    data.city2 = {
                        data: this.celsiusToFahrenheit(responseData.city2.data),
                        metadata: responseData.city2.metadata,
                        debug: responseData.city2.debug,
                        errors: responseData.city2.errors,
                        queries: responseData.city2.queries
                    };
                }
                this.maskTempResults = false;
                this.tempData = data;
                updatePrecipChart();
            };

            const tempFailure: Function = () => {
                alert('An error occurred fetching temperature data.  Please try again!');
                this.maskTempResults = false;
                updatePrecipChart();
            };

            Ajax.get(`api/temperature/${urlCityArgs}`, null, tempSuccess, tempFailure);
        }
    }
};

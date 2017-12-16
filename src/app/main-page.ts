import { /*ChartConfig, */ MonthRecord, TemperatureResponse, UnitConfig } from './climatediff';
import Utils from './Utils';
import Chart from './chart/chart.vue';
import CityForm from './city-form.vue';
import { Route } from 'vue-router';

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
        this.typeaheadWaitMillis = 500;

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
    beforeRouteUpdate(to: Route, from: Route, next) {
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

        setCitiesFromRoute(route: Route) {
            this.city1 = route.params.city1 || 'Raleigh, NC US';
            this.city2 = route.params.city2 || (route.params.city1 ? '' : 'Lexington, KY US');
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

            this.resultsTitle = 'Comparing ' + this.city1 + ' to ' + this.city2 + ':';

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

                const request: XMLHttpRequest = new XMLHttpRequest();
                request.onload = (e: Event) => {
                    console.log(JSON.stringify(request.response));
                    //result.data.data = celsiusToFahrenheit(result.data.data);
                    this.maskPrecipResults = false;
                    this.precipData = request.response;
                };
                request.onerror = (e: Event) => {
                    alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
                    this.maskPrecipResults = false;
                };

                request.open('GET', `api/precipitation/${urlCityArgs}`);
                request.responseType = 'json';
                request.send();
            };

            const request: XMLHttpRequest = new XMLHttpRequest();
            request.onload = (e: Event) => {
                // We must clone the response data since it is read-only and we want to mutate it
                const data: TemperatureResponse = {
                    data: this.celsiusToFahrenheit(request.response.data),
                    metadata: request.response.metadata,
                    debug: request.response.debug,
                    queries: request.response.queries
                };
                this.maskTempResults = false;
                this.tempData = data;
                updatePrecipChart();
            };
            request.onerror = (e: Event) => {
                alert('Sorry, something went wrong!\nThat\'s what happens with beta software.');
                this.maskTempResults = false;
                updatePrecipChart();
            };
            request.open('GET', `api/temperature/${urlCityArgs}`);
            request.responseType = 'json';
            request.send();
        }
    }
};

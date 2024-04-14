<template>
    <v-container
        fluid
        class="main-container"
    >
        <v-row
            wrap
            justify="center"
        >
            <v-col xs12>
                <CityForm
                    :initial-city1="city1"
                    :initial-city2="city2"
                    :submit-callback="updateClimateDiff"
                    :loading="loading"
                />
            </v-col>

            <v-col
                v-if="showCharts"
                xs12
                class="results-title"
            >
                <h1>{{ resultsTitle }}</h1>
            </v-col>

            <v-col
                v-if="showCharts"
                xs8
                class="results"
            >
                <Chart
                    chart-title="Temperature"
                    index="1"
                    title-icon="mdi-thermometer"
                    :data="tempData"
                    :chart-config="tempChartConfig"
                    :set-units-callback="setUnits"
                    :mask="maskTempResults"
                    min-prop="min"
                    max-prop="max"
                />
                <Chart
                    chart-title="Precipitation"
                    index="2"
                    title-icon="mdi-weather-pouring"
                    :data="precipData"
                    :chart-config="precipChartConfig"
                    :set-units-callback="setUnits"
                    :mask="maskPrecipResults"
                    max-prop="precip"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { PrecipDataPoint, TempDataPoint, Response, UnitConfig } from './climatediff';
import Utils from './utils';
import Chart from './chart/chart.vue';
import CityForm from './city-form.vue';
import { RouteLocationNormalized } from 'vue-router';
import dataSource, { Callback } from './data-source';

const TYPEAHEAD_WAIT_MILLIS: number = 500;

export default {
    components: {
        Chart,
        CityForm,
    },

    /**
     * Called when the route changes.  Update the UI to reflect our new cities.
     *
     * @param {RouteLocationNormalized} to The route we're going to.
     * @param {RouteLocationNormalized} from The route we're coming from.
     * @param next Callback.
     */
    // TODO: Why isn't this called?  We're calling Component.registerHooks()...
    beforeRouteUpdate(to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) {
        this.setCitiesFromRoute(to);
        next();
    },

    data() {
        return {
            city1: null,//string = null;
            city2: null,//string = null;
            loading: false,
            tempChartConfig: null,//ChartConfig = null;
            precipChartConfig: null,//ChartConfig = null;
            showCharts: false,
            maskTempResults: false,
            maskPrecipResults: false,
            resultsTitle: null,//string = null;
            tempData: null,//Response<TempDataPoint> = null;
            precipData: null,//Response<PrecipDataPoint> = null;
            typeaheadWatiMillis: TYPEAHEAD_WAIT_MILLIS,
        };
    },

    /**
     * Called when the component is first created.
     */
    created() {

        this.setCitiesFromRoute(this.$route);

        this.tempChartConfig = {
            units: [
                { axisSuffix: '\u00b0 F', label: '\u00b0 F', convert: Utils.arrayCtoF },
                { axisSuffix: '\u00b0 C', label: '\u00b0 C', convert: Utils.arrayFtoC },
            ],
        };
        const identity: (data: any) => any = (data: any) => {
            return data;
        };
        this.precipChartConfig = {
            units: [
                { axisSuffix: '"', label: 'in', convert: identity },
                { axisSuffix: 'cm', label: 'cm', convert: identity },
            ],
        };
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
        setCitiesFromRoute(route: RouteLocationNormalized) {

            const prevCity1: string = this.city1;
            const prevCity2: string = this.city2;

            this.city1 = Utils.cityRouteFormToReadableForm(route.params.city1 as string || 'Raleigh, NC US');
            this.city2 = Utils.cityRouteFormToReadableForm(
                route.params.city2 as string || (route.params.city1 ? '' : 'Lexington, KY US'));

            if (!route.params.city1 || this.city1 !== prevCity1 || this.city2 !== prevCity2) {
                this.showCharts = false;
            }
        },

        setUnits(unitConfig: UnitConfig) {
            // NOTE: This assumes exactly 2 unit choices, not > 2
            this.tempData.city1.data = unitConfig.convert.call(this, this.tempData.city1.data);
            if (this.tempData.city2) {
                this.tempData.city2.data = unitConfig.convert.call(this, this.tempData.city2.data);
            }
        },

        updateClimateDiff(city1: string, city2: string) {

            this.loading = true;

            this.$router.push({
                name: 'compare', params: {
                    city1: Utils.cityReadableFormToRouteForm(city1),
                    city2: Utils.cityReadableFormToRouteForm(city2),
                },
            });

            // Route params seem to be auto-bound to properties here?  So set our cities last to avoid '_'s in them.
            this.city1 = city1;
            this.city2 = city2;
            this.showCharts = true;
            this.maskTempResults = true;
            this.maskPrecipResults = true;

            this.resultsTitle = `Comparing ${this.city1} to ${this.city2}:`;

            // Mimic an empty data set to clear out previous graphs
            this.tempData = {};
            this.precipData = {};

            const updatePrecipChart: Function = () => {

                const precipSuccess: Callback<PrecipDataPoint> = (responseData: Response<PrecipDataPoint>) => {
                    console.log(JSON.stringify(responseData));
                    // result.data.data = celsiusToFahrenheit(result.data.data);
                    this.maskPrecipResults = false;
                    this.precipData = responseData;
                    this.loading = false;
                };
                const precipFailure: Function = () => {
                    alert('An error occurred fetching precipitation data!');
                    this.maskPrecipResults = false;
                    this.loading = false;
                };

                dataSource.getPrecipitationData(precipSuccess, precipFailure, this.city1, this.city2);
            };

            const tempSuccess: Callback<TempDataPoint> = (responseData: Response<TempDataPoint>) => {
                this.maskTempResults = false;
                this.tempData = responseData;
                updatePrecipChart();
            };

            const tempFailure: Function = () => {
                alert('An error occurred fetching temperature data.  Please try again!');
                this.maskTempResults = false;
                updatePrecipChart();
            };

            dataSource.getTemperatureData(tempSuccess, tempFailure, this.city1, this.city2);
        },
    },
};
</script>

<style scoped>
.main-container {
    padding: 0 !important;
}

.results-title {
    margin-top: 2rem;
}

.results {
    margin-top: 3em;
    text-align: center;
}
</style>

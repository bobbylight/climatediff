<template>
    <v-container
        fluid
        class="main-container"
    >
        <v-row
            wrap
            justify="center"
        >
            <v-col cols="12">
                <CityForm
                    :initial-city1="city1"
                    :initial-city2="city2"
                    :submit-callback="updateClimateDiff"
                    :loading="loading"
                />
            </v-col>
        </v-row>

        <v-row
            v-if="showCharts"
            wrap
            justify="center"
            class="pa-4 pa-md-0"
        >
            <v-col
                cols="12"
                class="results-title"
            >
                <h1>{{ resultsTitle }}</h1>
            </v-col>

            <v-col
                cols="12"
                md="8"
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

<script setup lang="ts">
import { Ref, onBeforeMount, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { PrecipDataPoint, TempDataPoint, Response, UnitConfig, ChartConfig } from './climatediff';
import Utils from './utils';
import Chart from './chart/chart.vue';
import CityForm from './city-form.vue';
import { RouteLocationNormalized } from 'vue-router';
import dataSource, { Callback } from './data-source';

const route = useRoute();
const router = useRouter();

const identity: (data: any) => any = (data: any) => data;

/**
 * Called when the route changes.  Update the UI to reflect our new cities.
 *
 * @param {RouteLocationNormalized} to The route we're going to.
 * @param {RouteLocationNormalized} from The route we're coming from.
 * @param next Callback.
 */
onBeforeRouteUpdate((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: Function) => {
    setCitiesFromRoute(to);
    next();
});

const city1 = ref(null); //string = null;
const city2 = ref(null); //string = null;
const loading = ref(false);
const tempChartConfig: Ref<ChartConfig> = ref({
    units: [
        { axisSuffix: '\u00b0 F', label: '\u00b0 F', convert: Utils.arrayCtoF },
        { axisSuffix: '\u00b0 C', label: '\u00b0 C', convert: Utils.arrayFtoC },
    ],
});
const precipChartConfig: Ref<ChartConfig> = ref({
    units: [
        { axisSuffix: '"', label: 'in', convert: identity },
        { axisSuffix: 'cm', label: 'cm', convert: identity },
    ],
});
const showCharts = ref(false);
const maskTempResults = ref(false);
const maskPrecipResults = ref(false);
const resultsTitle = ref(null); //string = null;
const tempData = ref(null); //Response<TempDataPoint> = null;
const precipData = ref(null); //Response<PrecipDataPoint> = null;

onBeforeMount(() => {
    // If cities were initially passed in, go ahead and run the comparison.
    if (route.params.city1 && route.params.city2) {
        const city1 = Utils.cityRouteFormToReadableForm(route.params.city1 as string);
        const city2 = Utils.cityRouteFormToReadableForm(route.params.city2 as string);
        updateClimateDiff(city1, city2);
    }
});

const setCitiesFromRoute = (route: RouteLocationNormalized) => {

    const prevCity1: string = city1.value;
    const prevCity2: string = city2.value;

    city1.value = Utils.cityRouteFormToReadableForm(route.params.city1 as string || 'Raleigh, NC US');
    city2.value = Utils.cityRouteFormToReadableForm(
        route.params.city2 as string || (route.params.city1 ? '' : 'Lexington, KY US'));

    if (!route.params.city1 || city1.value !== prevCity1 || city2.value !== prevCity2) {
        showCharts.value = false;
    }
};

const setUnits = (unitConfig: UnitConfig) => {
    // NOTE: This assumes exactly 2 unit choices, not > 2
    tempData.value.city1.data = unitConfig.convert.call(this, tempData.value.city1.data);
    if (tempData.value.city2) {
        tempData.value.city2.data = unitConfig.convert.call(this, tempData.value.city2.data);
    }
};

const updateClimateDiff = (newCity1: string, newCity2: string) => {

    loading.value = true;

    router.push({
        name: 'compare', params: {
            city1: Utils.cityReadableFormToRouteForm(newCity1),
            city2: Utils.cityReadableFormToRouteForm(newCity2),
        },
    });

    // Route params seem to be auto-bound to properties here?  So set our cities last to avoid '_'s in them.
    city1.value = newCity1;
    city2.value = newCity2;
    showCharts.value = true;
    maskTempResults.value = true;
    maskPrecipResults.value = true;

    resultsTitle.value = `Comparing ${city1.value} to ${city2.value}:`;

    // Mimic an empty data set to clear out previous graphs
    tempData.value = {};
    precipData.value = {};

    const updatePrecipChart: Function = () => {

        const precipSuccess: Callback<PrecipDataPoint> = (responseData: Response<PrecipDataPoint>) => {
            // result.data.data = celsiusToFahrenheit(result.data.data);
            maskPrecipResults.value = false;
            precipData.value = responseData;
            loading.value = false;
        };
        const precipFailure: Function = () => {
            alert('An error occurred fetching precipitation data!');
            maskPrecipResults.value = false;
            loading.value = false;
        };

        dataSource.getPrecipitationData(precipSuccess, precipFailure, city1.value, city2.value);
    };

    const tempSuccess: Callback<TempDataPoint> = (responseData: Response<TempDataPoint>) => {
        maskTempResults.value = false;
        tempData.value = responseData;
        updatePrecipChart();
    };

    const tempFailure: Function = () => {
        alert('An error occurred fetching temperature data.  Please try again!');
        maskTempResults.value = false;
        updatePrecipChart();
    };

    dataSource.getTemperatureData(tempSuccess, tempFailure, city1.value, city2.value);
};

setCitiesFromRoute(route);
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

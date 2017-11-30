<template>
    <div class='container'>

        <form @submit="updateClimateDiff" id='cityForm' role='form' class='form-inline'>

            <div class='row'>

                <span id='city1-span' class='col-md-3 col-md-offset-2 city-info'>
                    <label for='city1'>City 1:</label>
                    <input id='city1' type='text' v-model='city1' class='form-control' placeholder='City name' autofocus
                        typeahead-wait-ms='vm.typeaheadWaitMillis'
                        uib-typeahead="loc for loc in vm.getLocationCompletions($viewValue)" typeahead-loading="vm.loadingLocations1">
                </span>

                <span id='city2-span' class='col-md-3 city-info'>
                    <label for='city2'>City 2:</label>
                    <input id='city2' type='text' v-model='city2' class='form-control' placeholder='City name'
                        typeahead-wait-ms='vm.typeaheadWaitMillis'
                        uib-typeahead="loc for loc in vm.getLocationCompletions($viewValue)" typeahead-loading="vm.loadingLocations2">
                </span>

                <span id='submit-span' class='col-md-2'>
                    <button type='submit' class='form-control btn btn-primary'>Compare!</button>
                </span>
            </div>

            <div class='row'>
                <h1>{{resultsTitle}}</h1>
            </div>

        </form>

        <div id='results' v-if='showCharts'>
            <Chart chart-title='Temperature' spinner-index='1'
                   :data='tempData'
                   :chart-config='tempChartConfig'
                   :set-units-callback='setUnits'
                   :mask='maskTempResults'
                   min-prop="min" max-prop="max"></Chart>
            <Chart chart-title='Precipitation' spinner-index='2'
                   :data='precipData'
                   :chart-config='precipChartConfig'
                   :set-units-callback='setUnits'
                   :mask='maskPrecipResults'
                   max-prop="precip"></Chart>
        </div>

    </div>
</template>

<script lang="ts" src="./main-page.ts"></script>

<style lang="less">
#results {
    margin-top: 3em;
    text-align: center;
}

.city-info {
    white-space: nowrap;
}
</style>
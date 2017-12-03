<template>
    <div class='container'>

        <form @submit.prevent="updateClimateDiff" id='cityForm' role='form' class='form-inline'>

            <div class="row">

                <Typeahead url="api/locations" v-model="city1" filter-param-name="input" :data-map-function="locationMapper"
                           :query-params="locationQueryParams" id="city1" label="City 1:" placeholder="City name"
                           classes="col-md-3 col-md-offset-2 city-info" autofocus="true"></Typeahead>

                <Typeahead url="api/locations" v-model="city2" filter-param-name="input" :data-map-function="locationMapper"
                           :query-params="locationQueryParams" id="city2" label="City 2:" placeholder="City name"
                           classes="col-md-3 city-info"></Typeahead>

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
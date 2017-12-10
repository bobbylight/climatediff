<template>
    <v-container fluid class="main-container">

        <v-layout row wrap justify-center>

            <v-flex xs12 style="background: white">

                <v-container>
                    <v-layout row wrap justify-center>
                        <h1>Cities to compare:</h1>
                    </v-layout>
                </v-container>

                <form @submit.prevent="updateClimateDiff" id='cityForm' role='form' class='city-form'>

                    <v-container>
                        <v-layout row wrap justify-center>

                            <v-flex xs3>
                                <Typeahead url="api/locations" v-model="city1" filter-param-name="input" :data-map-function="locationMapper"
                                           :query-params="locationQueryParams" id="city1" label="City 1:" placeholder="City name"
                                           classes="city-info" autofocus="true"></Typeahead>
                            </v-flex>
                            <v-flex xs3 offset-xs1>
                                <Typeahead url="api/locations" v-model="city2" filter-param-name="input" :data-map-function="locationMapper"
                                           :query-params="locationQueryParams" id="city2" label="City 2:" placeholder="City name"
                                           classes="city-info"></Typeahead>
                            </v-flex>

                        </v-layout>
                    </v-container>

                    <v-container>
                        <v-layout row-wrap justify-center>
                            <v-btn type='submit' color="primary">Compare!</v-btn>
                        </v-layout>
                    </v-container>

                </form>
            </v-flex>

            <v-flex xs12>
                <h1>{{resultsTitle}}</h1>
            </v-flex>

            <v-flex xs8 id='results' v-if='showCharts'>

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

            </v-flex>

        </v-layout>
    </v-container>
</template>

<script lang="ts" src="./main-page.ts"></script>

<style lang="less">
.main-container {

    padding: 0;

    .city-form {
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2);
    }
}

#results {
    margin-top: 3em;
    text-align: center;
}

.city-info {
    white-space: nowrap;
}
</style>

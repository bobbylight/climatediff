<template>
    <v-container fluid class="main-container">

        <v-layout row wrap justify-center>

            <v-flex xs12 style="background: white">
                <CityForm :initial-city1="city1" :initial-city2="city2"
                          :submit-callback="updateClimateDiff"></CityForm>
            </v-flex>

            <v-flex xs12>
                <h1>{{resultsTitle}}</h1>
            </v-flex>

            <v-flex xs8 id='results' v-if='showCharts'>

                <Chart chart-title='Temperature' index="1"
                       :data='tempData'
                       :chart-config='tempChartConfig'
                       :set-units-callback='setUnits'
                       :mask='maskTempResults'
                       min-prop="min" max-prop="max"></Chart>
                <Chart chart-title='Precipitation' index="2"
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

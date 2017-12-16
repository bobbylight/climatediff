<template>
    <v-card>
        <v-toolbar color="primary" dark>
            <v-toolbar-title>{{chartTitle}}</v-toolbar-title>
        </v-toolbar>
        <div class='main-chart-div'>
            <div class='chart-content' ref="chartContent"> <!-- todo: some kind of fade in/out of bg while loading -->
                <vue-simple-spinner v-if="mask"></vue-simple-spinner>
                <svg v-show='dataLoaded' :id='chartId' class='chart' preserveAspectRatio="none"></svg>
                <div class="units-toggle">
                    <toggle-button @change="onUnitChange" :labels="unitLabels"></toggle-button>
                </div>
            </div>
            <ChartLegend :city-metadata="data.metadata" @armedCity="onArmedCityChanged"></ChartLegend>
        </div>
    </v-card>
</template>

<script lang="ts" src="./chart.ts"></script>

<style lang="less">
@import '../../css/variables.less';

@chart-axis-color: #888888;

.main-chart-div {
    margin-bottom: 2em;
    height: 450px;
    display: flex;
    flex-flow: column;
    position: relative;
    padding: 2rem;

    .chart-content {
        flex: 1 1 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }
}

.units-toggle {
    position: absolute;
    top: 0;
    right: 1rem;
}

/* Legend stuff */
.legend .legend-box {
    fill: white;
    stroke: @chart-border-color;
}

/* SVG chart styling */
.chart {

    width: 100%;
    height: 100%;
    /*width: 800px;*/
    /*height: 450px;*/
}

.axis {

    shape-rendering: crispEdges;
    font: 10px "Roboto", sans-serif;

    text {
        fill: @chart-axis-color;
    }
}

y {
    padding-left: 30px;
}

/* Area chart stuff */
.axis path,
.axis line {
    fill: none;
    stroke: @chart-axis-color;
    shape-rendering: crispEdges;
}

.area {

    fill-opacity: 0.3;
    stroke-width: 0;
    transition: fill-opacity @chart-transition-duration;


    &.area1 {
        fill: @chart-fill-1;
    }
    &.area2 {
        fill: @chart-fill-2;
    }

    &.unfocused {
        fill-opacity: @chart-unfocused-opacity;
    }
}

.line {

    fill: none;
    stroke-width: 1.5px;
    transition: stroke-opacity @chart-transition-duration;


    &.line1 {
        stroke: @chart-color-1;
    }
    &.line2 {
        stroke: @chart-color-2;
    }

    &.unfocused {
        stroke-opacity: @chart-unfocused-opacity;
    }
}

.chartPoint {

    transition: fill-opacity @chart-transition-duration;

    &.point1 {
        fill: @chart-color-1;
    }
    &.point2 {
        fill: @chart-color-2;
    }

    &.unfocused {
        fill-opacity: @chart-unfocused-opacity;
    }
}
</style>
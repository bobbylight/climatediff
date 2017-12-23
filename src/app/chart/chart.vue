<template>
    <v-card class="chart-card">
        <v-toolbar color="primary" dark>
            <v-toolbar-title style="padding-left: 16px">
                <v-icon class="title-icon" v-if="titleIcon">{{titleIcon}}</v-icon>
                {{chartTitle}}
            </v-toolbar-title>
        </v-toolbar>
        <v-alert v-for="(error, index) in errors" :key="error" v-model="showErrors"
                 class="chart-errors" transition="slide-y-transition" :dismissible="index === 0"
                 color="error" icon="priority_high">
            {{error}}
        </v-alert>
        <div class='main-chart-div'>
            <div class='chart-content' ref="chartContent"> <!-- todo: some kind of fade in/out of bg while loading -->
                <v-progress-circular v-if="mask" indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
                <svg v-show='dataLoaded' :id='chartId' class='chart' preserveAspectRatio="none"></svg>
                <div class="units-toggle">
                    <toggle-button @change="onUnitChange" :labels="unitLabels"
                            :value="unitToggleState"></toggle-button>
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
.chart-card {

    margin-bottom: 2em;

    .title-icon {
        font-size: 24px;
        margin-right: 16px;
    }

    .main-chart-div {
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

    .chart-errors {

        text-align: initial;
        margin-top: 0;
        margin-bottom: 0;

        // Make multiple alerts appear to be one big alert
        &:not(:first-of-type) {
            border-top: none;
            padding-top: 0;
        }
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

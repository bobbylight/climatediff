<template>
    <div>
        <div class='main-chart-div' style='position: relative'>
            <div class='chart-header'>
                <div>
                    <span class="chart-title">{{chartTitle}}</span>
                    <div class='btn-group pull-right' role='group' aria-label='Units' data-toggle='buttons'>
                        <label class='btn btn-default' v-for="unitConfig in chartConfig.units" uib-btn-radio='unitConfig.label'
                               @click="setUnits(unitConfig)">{{unitConfig.label}}</label>
                    </div>
                </div>
                <ChartLegend :city-metadata="data.metadata" @armedCity="onArmedCityChanged"></ChartLegend>
            </div>
            <div class='chart-content' ref="chartContent" style='padding: 10px'> <!-- todo: some kind of fade in/out of bg while loading -->
                <vue-simple-spinner v-if="mask"></vue-simple-spinner>
                <svg v-show='dataLoaded' :id='chartId' class='chart' preserveAspectRatio="none"></svg>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./chart.ts"></script>

<style lang="less">
@import '../../css/variables.less';

.main-chart-div {
    border: 1px solid @chart-border-color;
    border-radius: 4px 4px 0 0;
    margin-bottom: 2em;
    height: 450px;
    display: flex;
    flex-flow: column;
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

.axis text {
    fill: black;
    font: 10px sans-serif;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

y {
    padding-left: 30px;
}

.chart-header {
    padding-bottom: 1rem;
    text-align: initial;
    color: #808080;
    margin: 0.5em;
    flex: 0 1 auto;
    position: relative;

    .chart-title {
        font-weight: bolder;
        font-size: x-large;
    }
}

.chart-content {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Area chart stuff */
.axis path,
.axis line {
    fill: none;
    stroke: #000;
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

.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}
</style>
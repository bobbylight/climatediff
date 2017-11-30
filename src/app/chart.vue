<template>
    <div class='main-chart-div' style='position: relative'>
        <div class='area-chart results-label'>
            <div class='pull-left'>{{chartTitle}}</div>
            <div class='btn-group pull-right' role='group' aria-label='Units' data-toggle='buttons'>
                <label class='btn btn-default' v-for="unitConfig in chartConfig.units" uib-btn-radio='unitConfig.label'
                       @click="setUnits(unitConfig)">{{unitConfig.label}}</label>
            </div>
        </div>
        <div class='chart-content' ref="chartContent" style='padding: 10px'> <!-- todo: some kind of fade in/out of bg while loading -->
            <vue-simple-spinner v-if="mask"></vue-simple-spinner>
            <!--<span us-spinner="{radius:30, width:8, length: 16 }" spinner-key='spinner-{{spinnerIndex}}'></span>-->
            <svg v-show='dataLoaded' :id='chartId' class='chart' preserveAspectRatio="none"></svg>
        </div>
    </div>
</template>

<script lang="ts" src="./chart.ts"></script>

<style lang="less">
@chart-border-color: #ddd;

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

.area-chart.results-label {
    font-weight: bolder;
    font-size: x-large;
    padding-bottom: 2em;
    text-align: initial;
    color: #808080;
    margin: 0.5em;
    flex: 0 1 auto;
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

.area1 {
    fill: lightsteelblue;
    fill-opacity: 0.3;
    stroke-width: 0;
}

.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

.line1 {
    fill: none;
    stroke: steelblue;
    stroke-width: 1.5px;
}

.point1 {
    fill: steelblue;
}

.area2 {
    fill: lightcoral;
    fill-opacity: 0.3;
    stroke-width: 0;
}

.line2 {
    fill: none;
    stroke: maroon;
    stroke-width: 1.5px;
}

.point2 {
    fill: maroon;
}

</style>
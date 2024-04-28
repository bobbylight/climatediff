<template>
    <v-card class="chart-card">
        <v-toolbar
            color="primary"
            dark
        >
            <v-toolbar-title class="title">
                <v-icon
                    v-if="titleIcon"
                    class="title-icon"
                >
                    {{ titleIcon }}
                </v-icon>
                {{ chartTitle }}
            </v-toolbar-title>
        </v-toolbar>
        <v-alert
            v-for="(error, index2) in errors"
            :key="error"
            v-model="showErrors"
            class="chart-errors"
            transition="slide-y-transition"
            :dismissible="index2 === 0"
            color="error"
            icon="priority_high"
        >
            {{ error }}
        </v-alert>
        <div class="main-chart-div">
            <div
                ref="chartContent"
                class="chart-content"
            >
                <!-- todo: some kind of fade in/out of bg while loading -->
                <v-progress-circular
                    v-if="mask"
                    indeterminate
                    :size="70"
                    :width="7"
                    color="primary"
                />
                <svg
                    v-show="dataLoaded"
                    :id="chartId"
                    class="chart"
                    preserveAspectRatio="none"
                />
                <div class="units-toggle">
                    <toggle-button
                        :labels="unitLabels"
                        :value="unitToggleState"
                        @change="onUnitChange"
                    />
                </div>
            </div>
            <ChartLegend
                :city-labels="legendLabels"
                @armed-city="onArmedCityChanged"
            />
        </div>
    </v-card>
</template>

<script lang="ts">
import {
    CityInfo,
    PrecipDataPoint,
    TempDataPoint,
    Response,
    UnitConfig,
    //ChartConfig,
    Notification,
} from '../climatediff';
import * as d3 from 'd3';
import D3ToolTip from '../d3-tool-tip';
import MonthUtil from '../month-util';
import ChartLegend from './chart-legend.vue';
import Messages from '../messages';

const TRANSITION_DURATION_MILLIS: number = 300;
const MAX_CITY_COUNT: number = 2;

const POINT_SIZE_DEFAULT: number = 3;
const POINT_SIZE_ARMED: number = 6;

export default {
    components: {
        ChartLegend,
    },

    props: {
        index: {
            type: String,
            required: true,
        },
        chartTitle: {
            type: String,
            required: true,
        },
        titleIcon: {
            type: String,
            required: true,
        },
        chartConfig: {
            type: Object, //ChartConfig;
            required: true,
        },
        setUnitsCallback: {
            type: Function,
            required: true,
        },
        data: {
            type: Object,//Response<any>;
            required: true,
        },
        mask: Boolean,
        maxProp: {
            type: String,
            required: true,
        },
        minProp: {
            type: String,
            default: null,
        },
    },

    data() {
        return {
            errors: [],//string[]
            showErrors: false,
            selectedUnits: this.chartConfig.units[0],
            tips: [], //D3ToolTip[]
        };
    },

    computed: {
        dataLoaded() {
            return !this.mask;
        },

        chartId() {
            return `chart-${this.index}`;
        },

        legendLabels() {
            return Object.keys(this.data);
        },

        unitLabels() {
            return {
                checked: this.chartConfig.units[0].label,
                unchecked: this.chartConfig.units[1].label,
            };
        },

        unitToggleState() {
            return this.selectedUnits === this.chartConfig.units[0];
        },
    },

    watch: {
        data(newValue: Response<any>) {
            this.createChartAndShowErrors(newValue);
        },
    },

    created() {
        for (let i: number = 0; i < MAX_CITY_COUNT; i++) {
            this.tips.push(null);
            this.tips.push(null);
        }
    },

    mounted() {
        if (this.data) {
            this.createChartAndShowErrors(this.data);
        }
    },

    unmounted() {
        this.tips.forEach((tip: D3ToolTip) => {
            if (tip) {
                tip.destroy();
            }
        });
        this.tips.length = 0;
    },

    methods: {
        expandPoint(tipCallback: Function): d3.ValueFn<d3.BaseType, any, any> {
            // function scope important so 'this' refers to the mouseover'd DOM node
            return function (e: TempDataPoint) {
                tipCallback(e);
                d3.select(this).transition()
                    .attr('r', POINT_SIZE_ARMED);
            };
        },

        collapsePoint(tipCallback: Function): d3.ValueFn<d3.BaseType, any, any> {
            // function scope important so 'this' refers to the mouseover'd DOM node
            return function (e: TempDataPoint) {
                tipCallback(e);
                d3.select(this).transition()
                    .attr('r', POINT_SIZE_DEFAULT);
            };
        },

        createEmptyArea(xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>) {
            return d3.area()
                .x((d: any, i: number) => {
                    return xScale(i);
                })
                .y0((d: any) => {
                    return yScale(0);
                })
                .y1((d: any) => {
                    return yScale(0);
                })
                .curve(d3.curveCardinal);
        },

        appendCityArea(chart: d3.Selection<d3.BaseType, {}, null, undefined>, index: number,
            city: string, xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>,
            maxField: string, minField ?: string) {

            const data: Response<PrecipDataPoint | TempDataPoint> = this.data;
            if (!data || !data[city] || !data[city].data || data[city].data.length === 0) {
                return;
            }

            const cityData: any = data[city].data;
            if (cityData[0][maxField] === 'undefined') {
                console.log(`Note: No data in response for city: "${city}"`);
                return;
            }

            const area: d3.Area<[number, number]> = d3.area()
                .x((d: any, i: number) => {
                    return xScale(i);
                })
                .y0((d: any) => {
                    const index2: number = d[minField] || 0;
                    return yScale(index2);
                })
                .y1((d: any) => {
                    return yScale(d[maxField]);
                })
                .curve(d3.curveCardinal);
            chart.append('path')
                .datum(cityData)
                .attr('class', `area area${index + 1}`)
                .attr('d', area)
                .style('opacity', 0)
                .transition()
                .duration(TRANSITION_DURATION_MILLIS)
                .style('opacity', 1);

            if (minField) {
                const minLine: d3.Line<[number, number]> = d3.line()
                    .x((d: any, i: number) => {
                        return xScale(i);
                    })
                    .y((d: any) => {
                        return yScale(d[minField]);
                    })
                    .curve(d3.curveCardinal);
                chart.append('path')
                    .datum(cityData)
                    .attr('class', `line line${index + 1}`)
                    .attr('d', minLine)
                    .style('opacity', 0)
                    .transition()
                    .duration(TRANSITION_DURATION_MILLIS)
                    .style('opacity', 1);
            }

            const maxLine: d3.Line<[number, number]> = d3.line()
                .x((d: any, i: number) => {
                    return xScale(i);
                })
                .y((d: any) => {
                    return yScale(d[maxField]);
                })
                .curve(d3.curveCardinal);
            chart.append('path')
                .datum(cityData)
                .attr('class', `line line${index + 1}`)
                .attr('d', maxLine)
                .style('opacity', 0)
                .transition()
                .duration(TRANSITION_DURATION_MILLIS)
                .style('opacity', 1);

        },

        appendCityAreaPoints(chart: d3.Selection<d3.BaseType, {}, null, undefined>, index: number,
            city: string, xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>,
            maxVar: string, minVar ?: string) {

            const data: Response<PrecipDataPoint | TempDataPoint> = this.data;
            if (!data || !data[city] || !data[city].data || data[city].data.length === 0) {
                return;
            }

            const cityData: any = data[city].data;
            if (cityData[0][maxVar] === 'undefined') {
                console.log(`Note: No data in response for city: "${city}"`);
                return;
            }

            let tip: D3ToolTip = this.createNewTip(chart, index * 2, city, maxVar);
            this.createCityAreaPoints(chart, cityData, index, xScale, yScale, maxVar, tip);

            if (minVar) {
                tip = this.createNewTip(chart, index * 2 + 1, city, minVar);
                this.createCityAreaPoints(chart, cityData, index, xScale, yScale, minVar, tip);
            }
        },

        createCityAreaPoints(chart: d3.Selection<d3.BaseType, {}, null, undefined>, cityData: any, index: number,
            xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>, yVar: string,
            tip: D3ToolTip) {
            chart.selectAll('.point')
                .data(cityData)
                .enter().append('svg:circle')
                .attr('class', `chartPoint point${index + 1}`)
                .attr('cx', (d: any, i: number) => {
                    return xScale(i);
                })
                .attr('cy', (d: any, i: number) => {
                    return yScale(d[yVar]);
                })
                .attr('r', (d: any, i: number) => {
                    return 3;
                })
                .attr('pointer-events', 'all')
                .on('mouseover', this.expandPoint(tip.show) as any)
                .on('mouseout', this.collapsePoint(tip.hide) as any) // TODO: Fix this and previous line's types
                .style('opacity', 0)
                .transition()
                .duration(TRANSITION_DURATION_MILLIS)
                .style('opacity', 1);
        },

        fixViewBox(element: HTMLElement) {
            const mainChartDiv: HTMLElement = element.querySelector('.chart-content'); // Flex fill layout
            const width: number = mainChartDiv.offsetWidth;
            const height: number = mainChartDiv.offsetHeight;
            if (width > 0 && height > 0) {
                mainChartDiv.querySelector('.chart').setAttribute('viewBox', `0 0 ${width} ${height}`);
            }
        },

        createChart() {

            // Margins for axes.  Could also be used for spacing, titles, etc.
            const chartMargin: any = {top: 0, right: 0, bottom: 60, left: 40};

            // Height of actual chart content area.
            const chartWrapper: HTMLElement = this.$refs.chartContent as HTMLElement;
            const chartW: number = chartWrapper.offsetWidth;
            const chartH: number = chartWrapper.offsetHeight;
            const chartWidth: number = chartW - chartMargin.left - chartMargin.right;
            const chartHeight: number = chartH - chartMargin.top - chartMargin.bottom;
            const maxProp: string = this.maxProp;
            const minProp: string = this.minProp;

            // window.onresize = () => {
            //     const chartW: number = chartWrapper.offsetWidth;
            //     const chartH: number = chartWrapper.offsetHeight;
            //     this.$el.querySelector('svg').setAttribute('viewBox', '0 0 ' + chartW + ' ' + chartH);
            // })

            const yScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
                .range([chartHeight, 0]);

            const barPad: number = 0.1;
            // const xScale: d3.ScaleOrdinal<string, any> = d3.scaleOrdinal() // <any> to work around @types issue?
            const xScale: d3.ScalePoint<string> = d3.scalePoint()
            // .domain([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            // .domain([ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ])
                .domain(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])
            // .rangeRoundPoints([ 0, chartWidth ], barPad); //barPad, barOuterPad);
                .range([0, chartWidth])
                .padding(barPad);

            const data: Response<PrecipDataPoint | TempDataPoint> = this.data;

            const topPadding: number = 5;

            let min: number = 0;
            if (minProp) { // Chart is form min - max
                min = Math.min(...Object.keys(data).map((city: string) => {
                    return this.minForCity(data[city], minProp);
                }));
            }

            const max: number = Math.max(...Object.keys(data).map((city: string) => {
                return this.maxForCity(data[city], maxProp);
            }));

            yScale.domain([min, max + topPadding]);

            // Remove previous chart, if any
            const chartDomNode: Element = chartWrapper.querySelector('.chart');
            d3.select(chartDomNode)
                .select('g').remove();

            // If there's no data, bail now
            if (this.hasNoData(data)) {
                return;
            }

            const chart: d3.Selection<d3.BaseType, {}, null, undefined> = d3.select(chartDomNode)
                .append('g')
                .attr('transform', 'translate(' + chartMargin.left + ', ' + chartMargin.top + ')');

            const xAxis: d3.Axis<any> = d3.axisBottom(xScale)
            // .scale(xScale)
            // .orient('bottom')
                .tickFormat((d: any, i: number) => {
                    return MonthUtil.get(i);
                });
            chart.append('g')
                .classed('x', true)
                .classed('axis', true)
                .attr('transform', 'translate(0,' + chartHeight + ')')
                .call(xAxis);

            const yAxis: d3.Axis<any> = d3.axisLeft(yScale)
            // .scale(yScale)
            // .orient('left')
                .tickFormat((d: any) => {
                    return d + this.chartConfig.units[0].axisSuffix;
                }); // e.g. '"' or "deg. F"
            chart.append('g')
                .classed('y', true)
                .classed('axis', true)
                .call(yAxis);

            // Render area first, then points, so points are "above" in SVG and get mouseover events no matter what
            const cities: string[] = Object.keys(this.data);
            let index: number = 0;
            cities.forEach((city: string) => {
                this.appendCityArea(chart, index, city, xScale, yScale, maxProp, minProp);
                index++;
            });
            index = 0;
            cities.forEach((city: string) => {
                this.appendCityAreaPoints(chart, index, city, xScale, yScale, maxProp, minProp);
                index++;
            });

            this.fixViewBox(this.$el);
            //      $scope.resultsLoaded = true;
        },

        createChartAndShowErrors(data: Response<any>) {

            const notifications: Notification[] = [];

            Object.keys(data).forEach((city: string) => {
                if (data[city].errors && data[city].errors.length) {
                    notifications.push.apply(this.errors, data[city].errors);
                }
            });
            this.errors = Messages.localizeNotifications(notifications);
            this.showErrors = true;
            this.createChart();
        },

        /**
         * We must create a new tool tip for every set of data points unfortunately.  Delete the prior one and
         * add a replacement.
         */
        createNewTip(chart: any, index: number, city: string, dataVar: string): D3ToolTip {

            let tip: D3ToolTip = this.tips[index];
            if (tip) {
                tip.destroy();
            }

            this.tips[index] = tip = new D3ToolTip()
                .attr('class', 'd3-tip')
                .html((d: any) => {
                    let suffix: string = this.selectedUnits.axisSuffix;
                    const firstChar: string = suffix.charAt(0);
                    const firstIsLetter: boolean = firstChar >= 'a' && firstChar <= 'z';
                    suffix = firstIsLetter ? ` ${suffix}` : suffix;
                    return (Math.round(d[dataVar] * 10) / 10) + suffix;
                });

            chart.call(tip.init);
            tip.offset([-10, 0]);
            return tip;
        },

        hasNoData(data: Response<PrecipDataPoint | TempDataPoint>) {

            const keys: string[] = Object.keys(data);
            if (!keys.length) {
                return true;
            }

            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[i];
                if (data[key].data && data[key].data.length) {
                    return false;
                }
            }

            return true;
        },

        onArmedCityChanged(index: number | null) {

            let unfocused1: boolean = false;
            let unfocused2: boolean = false;

            if (index === 1) {
                unfocused2 = true;
            } else if (index === 2) {
                unfocused1 = true;
            }

            d3.selectAll('.area.area1, .line.line1, .chartPoint.point1').classed('unfocused', unfocused1);
            d3.selectAll('.area.area2, .line.line2, .chartPoint.point2').classed('unfocused', unfocused2);
        },

        maxForCity(city: CityInfo<TempDataPoint | PrecipDataPoint> | null,
            maxProp: string): number {

            let max: number = 100;

            if (city && city.data && city.data.length) {
                max = d3.max<any, number>(city.data,
                    (entry: TempDataPoint): number => {
                        return entry[maxProp];
                    });
            }

            return max;
        },

        minForCity(city: CityInfo<TempDataPoint | PrecipDataPoint> | null,
            minProp: string): number {

            let min: number = 0;

            if (city && city.data && city.data.length) {
                min = d3.min<any, number>(city.data,
                    (entry: TempDataPoint): number => {
                        return entry[minProp];
                    });
            }

            return min;
        },

        onUnitChange() {
            console.log('Units changed!');
        },

        setUnits(unitConfig: UnitConfig) {
            this.selectedUnits = unitConfig;
            this.setUnitsCallback(unitConfig);
        },
    },
};
</script>

<style>
.chart-card {
    margin-bottom: 2em;

    --chart-axis-color: #888888;
    --chart-border-color: #ddd;
    --chart-transition-duration: 0.3s;
    --chart-unfocused-opacity: 0.1;

    --chart-color-1: steelblue;
    --chart-fill-1: lightsteelblue;

    --chart-color-2: maroon;
    --chart-fill-2: lightcoral;

    .v-toolbar-title.title {
        margin-inline-start: 0;
    }
}

.main-chart-div {
    height: 450px;
    display: flex;
    flex-flow: column;
    position: relative;
    padding: 2rem;
}

.chart-content {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.chart-errors {

    text-align: initial;
    margin-top: 0;
    margin-bottom: 0;

    /* Make multiple alerts appear to be one big alert */
    &:not(:first-of-type) {
        border-top: none;
        padding-top: 0;
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
    stroke: var(--chart-border-color);
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
        fill: var(--chart-axis-color);
    }
}

y {
    padding-left: 30px;
}

/* Area chart stuff */
.axis path,
.axis line {
    fill: none;
    stroke: var(--chart-axis-color);
    shape-rendering: crispEdges;
}

.area {

    fill-opacity: 0.3;
    stroke-width: 0;
    transition: fill-opacity var(--chart-transition-duration);

    &.area1 {
        fill: var(--chart-fill-1);
    }
    &.area2 {
        fill: var(--chart-fill-2);
    }

    &.unfocused {
        fill-opacity: var(--chart-unfocused-opacity);
    }
}

.line {

    fill: none;
    stroke-width: 1.5px;
    transition: stroke-opacity var(--chart-transition-duration);


    &.line1 {
        stroke: var(--chart-color-1);
    }
    &.line2 {
        stroke: var(--chart-color-2);
    }

    &.unfocused {
        stroke-opacity: var(--chart-unfocused-opacity);
    }
}

.chartPoint {

    transition: fill-opacity var(--chart-transition-duration);

    &.point1 {
        fill: var(--chart-color-1);
    }
    &.point2 {
        fill: var(--chart-color-2);
    }

    &.unfocused {
        fill-opacity: var(--chart-unfocused-opacity);
    }
}
</style>

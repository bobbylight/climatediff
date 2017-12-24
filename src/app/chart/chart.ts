import {
    CityTemperatureInfo, CityTemperatureResponse, /*ChartConfig, */ TemperatureResponse,
    UnitConfig
} from '../climatediff';
import * as d3 from 'd3';
import { BaseType } from 'd3';
import D3ToolTip from '../d3-tool-tip';
import MonthUtil from '../month-util';
import ChartLegend from './chart-legend.vue';
import Messages from '../messages';

const TRANSITION_DURATION_MILLIS: number = 300;
const MAX_CITY_COUNT: number = 2;

const POINT_SIZE_DEFAULT: number = 3;
const POINT_SIZE_ARMED: number = 6;

/* tslint:disable:no-magic-numbers */
export default {

    components: {
        ChartLegend
    },

    props: {
        index: {
            type: String,
            required: true
        },
        chartTitle: {
            type: String,
            required: true
        },
        titleIcon: {
            type: String
        },
        chartConfig: {
            type: Object, // ChartConfig,
            required: true
        },
        setUnitsCallback: {
            type: Function,
            required: true
        },
        data: {
            type: Object, // TemperatureResponse,
            required: true
        },
        mask: {
            type: Boolean,
            required: true
        },
        maxProp: {
            type: String,
            required: true
        },
        minProp: {
            type: String,
            required: false
        }
    },

    data: function() {
        return {
            errors: [], // string[],
            showErrors: [], // boolean[],
            selectedUnits: this.chartConfig.units[0].label, // string,
            tips: [] // D3ToolTip[]
        };
    },

    created() {
        for (let i: number = 0; i < MAX_CITY_COUNT; i++) {
            this.tips.push(null);
            this.tips.push(null);
        }
    },

    methods: {

        expandPoint(tipCallback: Function): Function {
            // function scope important so 'this' refers to the mouseover'd DOM node
            return function(e: CityTemperatureInfo) {
                tipCallback(e);
                d3.select(this).transition()
                    .attr('r', POINT_SIZE_ARMED);
            };
        },

        collapsePoint(tipCallback: Function): Function {
            // function scope important so 'this' refers to the mouseover'd DOM node
            return function(e: CityTemperatureInfo) {
                tipCallback(e);
                d3.select(this).transition()
                    .attr('r', POINT_SIZE_DEFAULT);
            };
        },

        createEmptyArea(xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>) {
            return d3.area()
                .x((d: any, i: number) => { return xScale(i); })
                .y0((d: any) => { return yScale(0); })
                .y1((d: any) => { return yScale(0); })
                .curve(d3.curveCardinal);
        },

        appendCityArea(chart: d3.Selection<BaseType, {}, null, undefined>, index: number,
                xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>,
                maxField: string, minField ?: string) {

            const data: TemperatureResponse = this.data;
            const city: string = 'city' + (index + 1);
            if (!data || !data[city] || !data[city].data || data[city].data.length === 0) {
                return;
            }

            const cityData: any = data[city].data;
            if (cityData[0][maxField] === 'undefined') {
                console.log(`Note: No data in response for city: "${city}"`);
                return;
            }

            const area: d3.Area<[number, number]> = d3.area()
                .x((d: any, i: number) => { return xScale(i); })
                .y0((d: any) => { const index2: number = d[minField] || 0; return yScale(index2); })
                .y1((d: any) => { return yScale(d[maxField]); })
                .curve(d3.curveCardinal);
            chart.append('path')
                .datum(cityData)
                .attr('class', `area area${index + 1}`)
                .attr('d', this.createEmptyArea(xScale, yScale))
                .transition()
                .duration(TRANSITION_DURATION_MILLIS)
                .attr('d', area);

            if (minField) {
                const minLine: d3.Line<[number, number]> = d3.line()
                    .x((d: any, i: number) => { return xScale(i); })
                    .y((d: any) => { return yScale(d[minField]); })
                    .curve(d3.curveCardinal);
                chart.append('path')
                    .datum(cityData)
                    .attr('class', `line line${index + 1}`)
                    .attr('d', minLine);
            }

            const maxLine: d3.Line<[number, number]> = d3.line()
                .x((d: any, i: number) => { return xScale(i); })
                .y((d: any) => { return yScale(d[maxField]); })
                .curve(d3.curveCardinal);
            chart.append('path')
                .datum(cityData)
                .attr('class', `line line${index + 1}`)
                .attr('d', maxLine);

        },

        appendCityAreaPoints(chart: d3.Selection<BaseType, {}, null, undefined>, index: number,
                                  xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>,
                                  maxVar: string, minVar ?: string) {

            const data: TemperatureResponse = this.data;
            const city: string = 'city' + (index + 1);
            if (!data || !data[city] || !data[city].data || data[city].data.length === 0) {
                return;
            }

            const cityData: any = data[city].data;
            if (cityData[0][maxVar] === 'undefined') {
                console.log(`Note: No data in response for city: "${city}"`);
                return;
            }

            let tip: D3ToolTip = this.createNewTip(chart, index * 2, city, maxVar);
            chart.selectAll('.point')
                .data(cityData)
                .enter().append('svg:circle')
                .attr('class', `chartPoint point${index + 1}`)
                .attr('cx', (d: any, i: number) => { return xScale(i); })
                .attr('cy', (d: any, i: number) => {
                    return yScale(d[maxVar]);
                })
                .attr('r', (d: any, i: number) => { return 3; })
                .attr('pointer-events', 'all')
                .on('mouseover', this.expandPoint(tip.show))
                .on('mouseout', this.collapsePoint(tip.hide));

            if (minVar) {
                tip = this.createNewTip(chart, index * 2 + 1, city, minVar);
                chart.selectAll('.point')
                    .data(cityData)
                    .enter().append('svg:circle')
                    .attr('class', `chartPoint point${index + 1}`)
                    .attr('cx', (d: any, i: number) => { return xScale(i); })
                    .attr('cy', (d: any, i: number) => { return yScale(d[minVar]); })
                    .attr('r', (d: any, i: number) => { return 3; })
                    .attr('pointer-events', 'all')
                    .on('mouseover', this.expandPoint(tip.show))
                    .on('mouseout', this.collapsePoint(tip.hide));
            }

        },

        fixViewBox(element: HTMLElement) {
            const mainChartDiv: HTMLElement = element.querySelector('.chart-content'); // Flex fill layout
            const width: number = mainChartDiv.offsetWidth;
            const height: number = mainChartDiv.offsetHeight;
            console.log(width + ', ' + height);
            if (width > 0 && height > 0) {
                mainChartDiv.querySelector('.chart').setAttribute('viewBox', `0 0 ${width} ${height}`);
            }
        },

        createChart() {

            // Margins for axes.  Could also be used for spacing, titles, etc.
            const chartMargin: any = { top: 0, right: 0, bottom: 60, left: 40 };

            // Height of actual chart content area.
            const chartWrapper: HTMLElement = this.$refs.chartContent;
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
                .range([ chartHeight, 0 ]);

            const barPad: number = 0.1;
            // const xScale: d3.ScaleOrdinal<string, any> = d3.scaleOrdinal() // <any> to work around @types issue?
            const xScale: d3.ScalePoint<string> = d3.scalePoint()
            // .domain([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            // .domain([ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ])
                .domain([ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11' ])
                // .rangeRoundPoints([ 0, chartWidth ], barPad); //barPad, barOuterPad);
                .range([ 0, chartWidth ])
                .padding(barPad);

            const data: TemperatureResponse = this.data;

            const topPadding: number = 5;

            let min: number = 0;
            if (minProp) { // Chart is form min - max
                const min1: number = this.minForCity(data.city1, minProp);
                const min2: number = this.minForCity(data.city2, minProp);
                min = Math.min(min1, min2);
            }

            const max1: number = this.maxForCity(data.city1, maxProp);
            const max2: number = this.maxForCity(data.city2, maxProp);
            const max: number = Math.max(max1, max2);

            yScale.domain([ min, max + topPadding ]);

            // Remove previous chart, if any
            const chartDomNode: Element = chartWrapper.querySelector('.chart');
            d3.select(chartDomNode)
                .select('g').remove();

            // If there's no data, bail now
            if ((!data.city1 || !data.city1.data || !data.city1.data.length) &&
                (!data.city2 || !data.city2.data || !data.city2.data.length)) {
                return;
            }

            const chart: d3.Selection<BaseType, {}, null, undefined> = d3.select(chartDomNode)
                .append('g')
                .attr('transform', 'translate(' + chartMargin.left + ', ' + chartMargin.top + ')');

            const xAxis: d3.Axis<any> = d3.axisBottom(xScale)
            // .scale(xScale)
            // .orient('bottom')
                .tickFormat((d: any, i: number) => { return MonthUtil.get(i); });
            chart.append('g')
                .classed('x', true)
                .classed('axis', true)
                .attr('transform', 'translate(0,' + chartHeight + ')')
                .call(xAxis);

            const yAxis: d3.Axis<any> = d3.axisLeft(yScale)
            // .scale(yScale)
            // .orient('left')
                .tickFormat((d: any) => { return d + this.chartConfig.units[0].axisSuffix; }); // e.g. '"' or "deg. F"
            chart.append('g')
                .classed('y', true)
                .classed('axis', true)
                .call(yAxis);

            this.appendCityArea(chart, 0, xScale, yScale, maxProp, minProp);
            this.appendCityArea(chart, 1, xScale, yScale, maxProp, minProp);
            this.appendCityAreaPoints(chart, 0, xScale, yScale, maxProp, minProp);
            this.appendCityAreaPoints(chart, 1, xScale, yScale, maxProp, minProp);

            this.fixViewBox(this.$el);
        //      $scope.resultsLoaded = true;
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
                    const firstChar: string = this.selectedUnits.charAt(0);
                    const firstIsLetter: boolean = firstChar >= 'a' && firstChar <= 'z';
                    const suffix: string = firstIsLetter ? ` ${this.selectedUnits}` : this.selectedUnits;
                    return (Math.round(d[dataVar] * 10) / 10) + suffix;
                });

            chart.call(tip.init);
            tip.offset([ -10, 0 ]);
            return tip;
        },

        onArmedCityChanged(index: number | null) {

            let unfocused1: boolean = false;
            let unfocused2: boolean = false;

            if (index === 1) {
                unfocused2 = true;
            }
            else if (index === 2) {
                unfocused1 = true;
            }

            d3.selectAll('.area.area1, .line.line1, .chartPoint.point1').classed('unfocused', unfocused1);
            d3.selectAll('.area.area2, .line.line2, .chartPoint.point2').classed('unfocused', unfocused2);
        },

        maxForCity(city: CityTemperatureResponse | null | undefined, maxProp: string): number {

            let max: number = 100;

            if (city && city.data && city.data.length) {
                max = d3.max<CityTemperatureInfo, number>(city.data,
                    (entry: CityTemperatureInfo): number => {
                        return entry[maxProp];
                    });
            }

            return max;
        },

        minForCity(city: CityTemperatureResponse | null | undefined, minProp: string): number {

            let min: number = 0;

            if (city && city.data && city.data.length) {
                min = d3.min<CityTemperatureInfo, number>(city.data,
                    (entry: CityTemperatureInfo): number => {
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
        }
    },

    computed: {
        dataLoaded: function() {
            return !this.mask;
        },
        chartId: function() {
            return `chart-${this.index}`;
        },
        legendLabels: function() {
            const labels: string[] = [];
            if (this.data.city1) {
                labels.push(this.data.city1.metadata.city_name);
            }
            if (this.data.city2) {
                labels.push(this.data.city2.metadata.city_name);
            }
            return labels;
        },
        unitLabels: function() {
            return {
                checked: this.chartConfig.units[0].label,
                unchecked: this.chartConfig.units[1].label
            };
        },
        unitToggleState() {
            console.log(this.selectedUnits + ', ' + this.chartConfig.units[0].label);
            return this.selectedUnits === this.chartConfig.units[0].label;
        }
    },

    watch: {
        data(newValue: TemperatureResponse, oldValue: TemperatureResponse) {

            if (newValue === oldValue) {
                return; // First time through
            }

            this.errors = [];
            if (newValue.city1 && newValue.city1.errors && newValue.city1.errors.length) {
                this.errors.push.apply(this.errors, newValue.city1.errors);
            }
            if (newValue.city2 && newValue.city2.errors && newValue.city2.errors.length) {
                this.errors.push.apply(this.errors, newValue.city2.errors);
            }
            this.errors = Messages.localizeNotifications(this.errors);
            this.showErrors = [];
            for (let i: number = 0; i < this.errors.length; i++) {
                this.showErrors.push(true);
            }
            this.createChart();
        }
    }
};

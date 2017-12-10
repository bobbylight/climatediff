import { /*ChartConfig, */ MonthRecord, TemperatureResponse, UnitConfig } from '../climatediff';
import * as d3 from 'd3';
import { BaseType } from 'd3';
import D3ToolTip from '../d3-tool-tip';
import D3Legend from '../d3-legend';
import MonthUtil from '../month-util';
import VueSimpleSpinner from 'vue-simple-spinner';
import ChartLegend from './chart-legend.vue';

const TRANSITION_DURATION_MILLIS: number = 300;
const MAX_CITY_COUNT: number = 2;

export default {

    components: {
        VueSimpleSpinner,
        ChartLegend
    },

    props: {
        spinnerIndex: {
            type: String,
            required: true
        },
        chartTitle: {
            type: String,
            required: true
        },
        chartConfig: {
            type: Object, //ChartConfig,
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
            selectedUnits: null, //string,
            tips: [] // D3ToolTip[]
        };
    },

    created() {
        this.selectedUnits = this.chartConfig.units[0].label;
        for (let i: number = 0; i < MAX_CITY_COUNT; i++) {
            this.tips.push(null);
            this.tips.push(null);
        }
    },

    methods: {

        expandPoint(tipCallback: Function): Function {
            // function scope important so 'this' refers to the mouseover'd DOM node
            return function(e: MonthRecord) {
                tipCallback(e);
                d3.select(this).transition()
                    .attr('r', 6);
            };
        },

        collapsePoint(tipCallback: Function): Function {
            // function scope important so 'this' refers to the mouseover'd DOM node
            return function(e: MonthRecord) {
                tipCallback(e);
                d3.select(this).transition()
                    .attr('r', 3);
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

            const data: any = this.data;
            if (!data || !data.data || data.data.length === 0) {
                return;
            }

            const city: string = 'city' + (index + 1);
            if (!data.data[0][city]) {
                console.log(`Note: No data in response for city: "${city}"`);
                return;
            }

            const area: d3.Area<[number, number]> = d3.area()
                .x((d: any, i: number) => { return xScale(i); })
                .y0((d: any) => { const index2: number = d[city][minField] || 0; return yScale(index2); })
                .y1((d: any) => { return yScale(d[city][maxField]); })
                .curve(d3.curveCardinal);
            chart.append('path')
                .datum(data.data)
                .attr('class', `area area${index + 1}`)
                .attr('d', this.createEmptyArea(xScale, yScale))
                .transition()
                .duration(TRANSITION_DURATION_MILLIS)
                .attr('d', area);

            if (minField) {
                const minLine: d3.Line<[number, number]> = d3.line()
                    .x((d: any, i: number) => { return xScale(i); })
                    .y((d: any) => { return yScale(d[city][minField]); })
                    .curve(d3.curveCardinal);
                chart.append('path')
                    .datum(data.data)
                    .attr('class', `line line${index + 1}`)
                    .attr('d', minLine);
            }

            const maxLine: d3.Line<[number, number]> = d3.line()
                .x((d: any, i: number) => { return xScale(i); })
                .y((d: any) => { return yScale(d[city][maxField]); })
                .curve(d3.curveCardinal);
            chart.append('path')
                .datum(data.data)
                .attr('class', `line line${index + 1}`)
                .attr('d', maxLine)
                .attr('data-legend', (d: any) => {
                    return data.metadata[index].city_name;
                })
                .attr('data-legend-pos', index);

        },

        appendCityAreaPoints(chart: d3.Selection<BaseType, {}, null, undefined>, index: number,
                                  xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>,
                                  maxVar: string, minVar ?: string) {

            const data: TemperatureResponse = this.data;
            if (!data || !data.data || data.data.length === 0) {
                return;
            }

            const city: string = 'city' + (index + 1);
            if (!data.data[0][city]) {
                console.log(`Note: No data in response for city: "${city}"`);
                return;
            }

            let tip: D3ToolTip = this.createNewTip(chart, index * 2, city, maxVar);
            chart.selectAll('.point')
                .data(data.data)
                .enter().append('svg:circle')
                .attr('class', `chartPoint point${index + 1}`)
                .attr('cx', (d: any, i: number) => { return xScale(i); })
                .attr('cy', (d: any, i: number) => { return yScale(d[city][maxVar]); })
                .attr('r', (d: any, i: number) => { return 3; })
                .attr('pointer-events', 'all')
                .on('mouseover', this.expandPoint(tip.show))
                .on('mouseout', this.collapsePoint(tip.hide));

            if (minVar) {
                tip = this.createNewTip(chart, index * 2 + 1, city, minVar);
                chart.selectAll('.point')
                    .data(data.data)
                    .enter().append('svg:circle')
                    .attr('class', `chartPoint point${index + 1}`)
                    .attr('cx', (d: any, i: number) => { return xScale(i); })
                    .attr('cy', (d: any, i: number) => { return yScale(d[city][minVar]); })
                    .attr('r', (d: any, i: number) => { return 3; })
                    .attr('pointer-events', 'all')
                    .on('mouseover', this.expandPoint(tip.show))
                    .on('mouseout', this.collapsePoint(tip.hide));
            }

        },

        fixViewBox(element: JQuery) {
            const mainChartDiv: JQuery = element.find('.chart-content'); // Flex fill layout
            const width: number = mainChartDiv.width();
            const height: number = mainChartDiv.height();
            console.log(width + ', ' + height);
            if (width > 0 && height > 0) {
                mainChartDiv.find('.chart').get(0).setAttribute('viewBox', `0 0 ${width} ${height}`);
            }
        },

        createChart() {

            // Margins for axes.  Could also be used for spacing, titles, etc.
            const chartMargin: any = { top: 0, right: 0, bottom: 60, left: 40 };

            // Height of actual chart content area.
            const $chartWrapper: JQuery = $(this.$refs.chartContent);// element.find('.chart-content');
            const chartW: number = $chartWrapper.width();
            const chartH: number = $chartWrapper.height();
            let chartWidth: number = chartW - chartMargin.left - chartMargin.right;
            let chartHeight: number = chartH - chartMargin.top - chartMargin.bottom;
            const maxProp: string = this.maxProp;
            const minProp: string = this.minProp;

            // $(window).on('resize', () => {
            //     const chartW: number = $chartElem.width();
            //     const chartH: number = $chartElem.height();
            //     element.find('svg').get(0).setAttribute('viewBox', '0 0 ' + chartW + ' ' + chartH);
            // })

            const yScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
                .range([ chartHeight, 0 ]);

            const barPad: number = 0.1;
            //const xScale: d3.ScaleOrdinal<string, any> = d3.scaleOrdinal() // <any> to work around @types issue?
            const xScale: d3.ScalePoint<string> = d3.scalePoint()
            //.domain([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            //.domain([ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ])
                .domain([ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11' ])
                //.rangeRoundPoints([ 0, chartWidth ], barPad); //barPad, barOuterPad);
                .range([ 0, chartWidth ])
                .padding(barPad);

            const data: MonthRecord[] = this.data.data;

            const topPadding: number = 5;

            let min: number, max: number;
            function maxFrom2Cities(entry: MonthRecord): number {
                let max1: number = entry.city1 ? entry.city1[maxProp] : 0;
                let max2: number = entry.city2 ? entry.city2[maxProp] : 0;
                return Math.max(max1, max2);
            }
            function minFrom2Cities(entry: MonthRecord): number {
                let min1: number = entry.city1 ? entry.city1[minProp] : 0;
                let min2: number = entry.city2 ? entry.city2[minProp] : 0;
                return Math.min(min1, min2);
            }
            if (data.length !== 0) {
                if (minProp) { // Chart is form min - max
                    min = d3.min<MonthRecord, number>(data, (entry: MonthRecord): number => {
                        return minFrom2Cities(entry);
                    });
                    min = Math.min(min, 0);
                }
                else { // Chart is from 0 - value
                    min = 0;
                }
                // Intellij expects a type assertion here but tsc doesn't
                max = d3.max<MonthRecord, number>(data, (entry: MonthRecord): number => {
                    return maxFrom2Cities(entry);
                });
            }
            else {
                min = 0;
                max = 100;
            }
            yScale.domain([min, max + topPadding]);

            // Remove previous chart, if any
            const $chartElem: JQuery = $chartWrapper.find('.chart');  //element.find('.chart');
            const chartDomNode: Element = $chartElem[0] as Element;
            d3.select(chartDomNode)
                .select('g').remove();

            // If there's no data, bail now
            if (!data.length) {
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
                .call(xAxis)
                // Rotate text on x-axis
                .selectAll('text')
                .style('text-anchor', 'end')
                .attr('dx', '-.8em')
                .attr('dy', '.15em')
                .attr('transform', (d: any) => { return 'rotate(-65)'; });

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

            const legend: D3Legend = new D3Legend();
            chart.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(50, 35)')
                .style('font-size', '12px')
                .call(legend.init);

            this.fixViewBox($(this.$el)); //element);
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
                    return Math.round(d[city][dataVar] * 10) / 10;
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
            return `chart-${this.spinnerIndex}`;
        },
        unitLabels: function() {
            return {
                checked: this.chartConfig.units[0].label,
                unchecked: this.chartConfig.units[1].label
            };
        }
    },

    watch: {
        data(newValue, oldValue) {
            if (newValue === oldValue) {
                return; // First time through
            }
            this.createChart();
        }
    }
};

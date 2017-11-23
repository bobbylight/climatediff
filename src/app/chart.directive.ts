import { ChartConfig, MonthRecord, TemperatureResponse } from './climatediff';
import * as d3 from 'd3';
import MonthService from './month.service';
import { BaseType } from 'd3';

export class ChartController {

    spinnerIndex: number;
    chartTitle: string;
    chartConfig: ChartConfig;
    setUnits: Function;
    data: TemperatureResponse;
    foo: MonthService;
    mask: any;
    createChart: () => void;
    dataLoaded: boolean;
    minProp: string;
    maxProp: string;
    selectedUnits: string;

    static $inject: string[] = [ '$scope' ];

    constructor(private $scope: ng.IScope) {
    }

    $onInit() {

        this.selectedUnits = this.chartConfig.units[0].label;

        // TODO: This should not be a deep watch; we should watch on the entire object, then just on data.data
        // for subsequent updates via the units buttons
        this.$scope.$watch(() => { return this.data; }, (newValue: any, oldValue: any) => {
            if (newValue === oldValue) {
                return; // First time through
            }
            this.createChart();
        }, true);

    }
}

export default (usSpinnerService: any, $log: ng.ILogService, Months: MonthService) => {

    const TRANSITION_DURATION_MILLIS: number = 300;

    // function expandPoint(tipCallback: Function): (e: MonthRecord) => void {
    //     return function(e: MonthRecord) {
    //         tipCallback(e);
    //         d3.select(this).transition()
    //             .attr('r', 6);
    //     };
    // }
    // function collapsePoint(tipCallback: Function): (e: MonthRecord) => void {
    //     return function(e: MonthRecord) {
    //         tipCallback(e);
    //         d3.select(this).transition()
    //             .attr('r', 3);
    //     };
    // }

    function createEmptyArea(xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>) {
        return d3.area()
            .x(function(d: any, i: number) { return xScale(i); })
            .y0(function(d: any) { return yScale(0); })
            .y1(function(d: any) { return yScale(0); })
            //.interpolate('cardinal');
            .curve(d3.curveCardinal);
    }

    function appendCityArea(chart: d3.Selection<BaseType, {}, null, undefined>, controller: ChartController, index: number,
                            xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>,
                            maxField: string, minField ?: string) {

        const data: any = controller.data;
        if (!data || !data.data || data.data.length === 0) {
            return;
        }

        const city: string = 'city' + (index + 1);
        if (!data.data[0][city]) {
            $log.log('Note: No data in response for city: "' + city + '"');
            return;
        }

        const area: d3.Area<[number, number]> = d3.area()
            .x(function(d: any, i: number) { return xScale(i); })
            .y0(function(d: any) { const index2: number = d[city][minField] || 0; return yScale(index2); })
            .y1(function(d: any) { return yScale(d[city][maxField]); })
            //.interpolate('cardinal');
            .curve(d3.curveCardinal);
        chart.append('path')
            .datum(data.data)
            .attr('class', 'area' + (index + 1))
            .attr('d', createEmptyArea(xScale, yScale))
            .transition()
            .duration(TRANSITION_DURATION_MILLIS)
            .attr('d', area);

        if (minField) {
            const minLine: d3.Line<[number, number]> = d3.line()
                .x(function(d: any, i: number) { return xScale(i); })
                .y(function(d: any) { return yScale(d[city][minField]); })
                //.interpolate('cardinal');
                .curve(d3.curveCardinal);
            chart.append('path')
                .datum(data.data)
                .attr('class', 'line' + (index + 1))
                .attr('d', minLine);
        }

        const maxLine: d3.Line<[number, number]> = d3.line()
            .x(function(d: any, i: number) { return xScale(i); })
            .y(function(d: any) { return yScale(d[city][maxField]); })
            //.interpolate('cardinal');
            .curve(d3.curveCardinal);
        chart.append('path')
            .datum(data.data)
            .attr('class', 'line' + (index + 1))
            .attr('d', maxLine)
            .attr('data-legend', (d: any) => { return data.metadata[index].city_name; })
            .attr('data-legend-pos', index);

    }

    function appendCityAreaPoints(chart: d3.Selection<BaseType, {}, null, undefined>, controller: ChartController, index: number,
                                xScale: d3.ScalePoint<any>, yScale: d3.ScaleLinear<number, number>,
                                  maxVar: string, minVar ?: string) {

        const data: TemperatureResponse = controller.data;
        if (!data || !data.data || data.data.length === 0) {
            return;
        }

        const city: string = 'city' + (index + 1);
        if (!data.data[0][city]) {
            $log.log('Note: No data in response for city: "' + city + '"');
            return;
        }

        // let tip: any = d3.tip().attr('class', 'd3-tip').html((d: any) => {
        //     return d[city][maxVar];
        // });
        // chart.call(tip);
        // tip.offset([ -10, 0 ]);
        chart.selectAll('.point')
            .data(data.data)
            .enter().append('svg:circle')
            .attr('class', 'point' + (index + 1))
            .attr('cx', function(d: any, i: number) { return xScale(i); })
            .attr('cy', function(d: any, i: number) { return yScale(d[city][maxVar]); })
            .attr('r', function(d: any, i: number) { return 3; })
            .attr('pointer-events', 'all')
            // .on('mouseover', expandPoint(tip.show))
            // .on('mouseout', collapsePoint(tip.hide));
            ;

        if (minVar) {
            // tip = d3.tip().attr('class', 'd3-tip').html(function(d: MonthRecord) {
            //     return d[city][minVar];
            // });
            // chart.call(tip);
            // tip.offset([ -10, 0 ]);
            chart.selectAll('.point')
                .data(data.data)
                .enter().append('svg:circle')
                .attr('class', 'point' + (index + 1))
                .attr('cx', function(d: any, i: number) { return xScale(i); })
                .attr('cy', function(d: any, i: number) { return yScale(d[city][minVar]); })
                .attr('r', function(d: any, i: number) { return 3; })
                .attr('pointer-events', 'all')
                // .on('mouseover', expandPoint(tip.show))
                // .on('mouseout', collapsePoint(tip.hide));
                ;
        }

    }

    function fixViewBox(element: JQuery) {
        const mainChartDiv: JQuery = element.find('.chart-content'); // Flex fill layout
        const width: number = mainChartDiv.width();
        const height: number = mainChartDiv.height();
        $log.log(width + ', ' + height);
        if (width > 0 && height > 0) {
            mainChartDiv.find('.chart').get(0).setAttribute('viewBox', '0 0 ' + width + ' ' + height);
        }
    }

    function createChart($scope: ng.IScope, element: JQuery, controller: ChartController) {

        // Margins for axes.  Could also be used for spacing, titles, etc.
        const chartMargin: any = { top: 0, right: 0, bottom: 60, left: 40 };

        // Height of actual chart content area.
        const $chartWrapper: JQuery = element.find('.chart-content');
        const chartW: number = $chartWrapper.width();
        const chartH: number = $chartWrapper.height();
        let chartWidth: number = chartW - chartMargin.left - chartMargin.right;
        let chartHeight: number = chartH - chartMargin.top - chartMargin.bottom;
        const maxProp: string = controller.maxProp;
        const minProp: string = controller.minProp;

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

        const data: MonthRecord[] = controller.data.data;

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
        const $chartElem: JQuery = element.find('.chart');
        const chartDomNode: Element = $chartElem[0] as Element;
        d3.select(chartDomNode)
            .select('g').remove();

        const chart: d3.Selection<BaseType, {}, null, undefined> = d3.select(chartDomNode)
            .append('g')
            .attr('transform', 'translate(' + chartMargin.left + ', ' + chartMargin.top + ')');

        const xAxis: d3.Axis<any> = d3.axisBottom(xScale)
            // .scale(xScale)
            // .orient('bottom')
            .tickFormat(<any>function(d: any, i: number) { return Months.get(i); });
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
            .attr('transform', function(d: any) { return 'rotate(-65)'; });

        const yAxis: d3.Axis<any> = d3.axisLeft(yScale)
            // .scale(yScale)
            // .orient('left')
            .tickFormat(function(d: any) { return d + controller.chartConfig.units[0].axisSuffix; }); // e.g. '"' or "deg. F"
        chart.append('g')
            .classed('y', true)
            .classed('axis', true)
            .call(yAxis);

        appendCityArea(chart, controller, 0, xScale, yScale, maxProp, minProp);
        appendCityArea(chart, controller, 1, xScale, yScale, maxProp, minProp);
        appendCityAreaPoints(chart, controller, 0, xScale, yScale, maxProp, minProp);
        appendCityAreaPoints(chart, controller, 1, xScale, yScale, maxProp, minProp);

        fixViewBox(element);
//      $scope.resultsLoaded = true;

        chart.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(50, 30)')
            .style('font-size', '12px')
            ; //.call(d3.legend);

    }

    return {
        restrict: 'E',
        scope: {
            spinnerIndex: '@spinnerIndex',
            chartTitle: '@title',
            chartConfig: '=',
            setUnits: '&',
            data: '=',
            mask: '=',
            maxProp: '=',
            minProp: '='
        },
        controller: ChartController,
        controllerAs: 'vm',
        bindToController: true,
        link: function(scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, controller: ChartController) {

            controller.createChart = () => { createChart(scope, element, controller); };

            const spinnerId: string = 'spinner-' + controller.spinnerIndex;
            scope.$watch(() => { return controller.mask; }, (newValue: boolean, oldValue: boolean) => {
                if (newValue === oldValue) {
                    return; // First time through
                }
                controller.dataLoaded = !newValue;
                if (newValue) {
                    usSpinnerService.spin(spinnerId);
                }
                else {
                    usSpinnerService.stop(spinnerId);
                }
            });

        },
        templateUrl: 'directives/chart.html'
    };

};

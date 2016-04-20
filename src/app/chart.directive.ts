module climatediff {
    'use strict';

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

        static $inject: string[] = [ '$scope' ];

        constructor($scope: ng.IScope) {

            $scope.$watch(() => { return this.data; }, (newValue: any, oldValue: any) => {
                if (newValue === oldValue) {
                    return; // First time through
                }
                this.createChart();
            });

        }
    }
}

angular.module('cdApp').directive('cdChart', [ 'usSpinnerService', 'Months', function(usSpinnerService: any, Months: climatediff.MonthService) {
    'use strict';

    const TRANSITION_DURATION_MILLIS: number = 300;

    function expandPoint(tipCallback: Function): (e: climatediff.MonthRecord) => void {
        return function(e: climatediff.MonthRecord) {
            tipCallback(e);
            d3.select(this).transition()
                .attr('r', 6);
        };
    }
    function collapsePoint(tipCallback: Function): (e: climatediff.MonthRecord) => void {
        return function(e: climatediff.MonthRecord) {
            tipCallback(e);
            d3.select(this).transition()
                .attr('r', 3);
        };
    }

    function createEmptyArea(xScale: any, yScale: Function) {
        return d3.svg.area()
            .x(function(d: any, i: number) { return xScale(i); })
            .y0(function(d: any) { return yScale(0); })
            .y1(function(d: any) { return yScale(0); })
            .interpolate('cardinal');
    }

    function appendCityArea(chart: d3.Selection<any>, controller: climatediff.ChartController, index: number,
                            xScale: any, yScale: Function, maxField: string, minField ?: string) {

        const data: any = controller.data;
        if (!data || !data.data || data.data.length === 0) {
            return;
        }

        const city: string = 'city' + (index + 1);
        if (!data.data[0][city]) {
            console.log('Note: No data in response for city: "' + city + '"');
            return;
        }

        const area: d3.svg.Area<[number, number]> = d3.svg.area()
            .x(function(d: any, i: number) { return xScale(i); })
            .y0(function(d: any) { const index2: number = d[city][minField] || 0; return yScale(index2); })
            .y1(function(d: any) { return yScale(d[city][maxField]); })
            .interpolate('cardinal');
        chart.append('path')
            .datum(data.data)
            .attr('class', 'area' + (index + 1))
            .attr('d', createEmptyArea(xScale, yScale))
            .transition()
            .duration(TRANSITION_DURATION_MILLIS)
            .attr('d', area);

        if (minField) {
            const minLine: d3.svg.Line<[number, number]> = d3.svg.line()
                .x(function(d: any, i: number) { return xScale(i); })
                .y(function(d: any) { return yScale(d[city][minField]); })
                .interpolate('cardinal');
            chart.append('path')
                .datum(data.data)
                .attr('class', 'line' + (index + 1))
                .attr('d', minLine);
        }

        const maxLine: d3.svg.Line<[number, number]> = d3.svg.line()
            .x(function(d: any, i: number) { return xScale(i); })
            .y(function(d: any) { return yScale(d[city][maxField]); })
            .interpolate('cardinal');
        chart.append('path')
            .datum(data.data)
            .attr('class', 'line' + (index + 1))
            .attr('d', maxLine)
            .attr('data-legend', (d: any) => { return data.metadata[index].city_name; })
            .attr('data-legend-pos', index);

    }

    function appendCityAreaPoints(chart: d3.Selection<any>, controller: climatediff.ChartController, index: number,
                                  xScale: any, yScale: Function, maxVar: string, minVar ?: string) {

        const data: climatediff.TemperatureResponse = controller.data;
        if (!data || !data.data || data.data.length === 0) {
            return;
        }

        const city: string = 'city' + (index + 1);
        if (!data.data[0][city]) {
            console.log('Note: No data in response for city: "' + city + '"');
            return;
        }

        let tip: any = d3.tip().attr('class', 'd3-tip').html((d: any) => {
            return d[city][maxVar];
        });
        chart.call(tip);
        tip.offset([ -10, 0 ]);
        let points: d3.Selection<climatediff.MonthRecord> = chart.selectAll('.point')
            .data(data.data)
            .enter().append('svg:circle')
            .attr('class', 'point' + (index + 1))
            .attr('cx', function(d: any, i: number) { return xScale(i); })
            .attr('cy', function(d: any, i: number) { return yScale(d[city][maxVar]); })
            .attr('r', function(d: any, i: number) { return 3; })
            .attr('pointer-events', 'all')
            .on('mouseover', expandPoint(tip.show))
            .on('mouseout', collapsePoint(tip.hide));

        if (minVar) {
            tip = d3.tip().attr('class', 'd3-tip').html(function(d: climatediff.MonthRecord) {
                return d[city][minVar];
            });
            chart.call(tip);
            tip.offset([ -10, 0 ]);
            points = chart.selectAll('.point')
                .data(data.data)
                .enter().append('svg:circle')
                .attr('class', 'point' + (index + 1))
                .attr('cx', function(d: any, i: number) { return xScale(i); })
                .attr('cy', function(d: any, i: number) { return yScale(d[city][minVar]); })
                .attr('r', function(d: any, i: number) { return 3; })
                .attr('pointer-events', 'all')
                .on('mouseover', expandPoint(tip.show))
                .on('mouseout', collapsePoint(tip.hide));
        }

    }

    function fixViewBox(element: JQuery) {
        const mainChartDiv: JQuery = element.find('.chart-content'); // Flex fill layout
        const width: number = mainChartDiv.width();
        const height: number = mainChartDiv.height();
        console.log(width + ', ' + height);
        if (width > 0 && height > 0) {
            mainChartDiv.find('.chart').get(0).setAttribute('viewBox', '0 0 ' + width + ' ' + height);
        }
    }

    function createChart($scope: ng.IScope, element: JQuery, controller: climatediff.ChartController) {

        // Margins for axes.  Could also be used for spacing, titles, etc.
        const chartMargin: any = { top: 0, right: 0, bottom: 60, left: 40 };

        // Height of actual chart content area.
        const $chartWrapper: JQuery = $(element).find('.chart-content');
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

        const yScale: d3.scale.Linear<number, number> = d3.scale.linear()
            .range([ chartHeight, 0 ]);

        const barPad: number = 0.1;
        const xScale: d3.scale.Ordinal<string, any> = (<any>d3.scale.ordinal()) // <any> to work around d3 typings issue?
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            .rangeRoundPoints([ 0, chartWidth ], barPad); //barPad, barOuterPad);

        const data: climatediff.MonthRecord[] = controller.data.data;

        const topPadding: number = 5;

        var min: number, max: number;
        function maxFrom2Cities(entry: climatediff.MonthRecord) {
            var max1: number = entry.city1 ? entry.city1[maxProp] : 0;
            var max2: number = entry.city2 ? entry.city2[maxProp] : 0;
            return Math.max(max1, max2);
        }
        function minFrom2Cities(entry: climatediff.MonthRecord) {
            var min1: number = entry.city1 ? entry.city1[minProp] : 0;
            var min2: number = entry.city2 ? entry.city2[minProp] : 0;
            return Math.min(min1, min2);
        }
        if (data.length !== 0) {
            if (minProp) { // Chart is form min - max
                min = d3.min(data, function (entry: climatediff.MonthRecord) {
                    return minFrom2Cities(entry);
                });
                min = Math.min(min, 0);
            }
            else { // Chart is from 0 - value
                min = 0;
            }
            max = d3.max(data, function(entry: climatediff.MonthRecord) { return maxFrom2Cities(entry); });
        }
        else {
            min = 0;
            max = 100;
        }
        yScale.domain([min, max + topPadding]);

        // Remove previous chart, if any
        const $chartElem: JQuery = $(element).find('.chart');
        var chartDomNode: Node = $chartElem[0];
        d3.select(chartDomNode)
            .select('g').remove();

        const chart: d3.Selection<any> = d3.select(chartDomNode)
            .append('g')
            .attr('transform', 'translate(' + chartMargin.left + ', ' + chartMargin.top + ')');

        const xAxis: d3.svg.Axis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .tickFormat(<any>function(d: any, i: number) { return Months.get(i); }); // <any> cast to work around bad typings definition
        chart.append('g')
            .classed({ 'x': true, 'axis': true })
            .attr('transform', 'translate(0,' + chartHeight + ')')
            .call(xAxis)
            // Rotate text on x-axis
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', function(d: any) { return 'rotate(-65)'; });

        const yAxis: d3.svg.Axis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickFormat(function(d: any) { return d + controller.chartConfig.unit; }); // e.g. '"' or "deg. F"
        chart.append('g')
            .classed({ 'y': true, 'axis': true })
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
            .call(d3.legend);

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
        controller: climatediff.ChartController,
        controllerAs: 'vm',
        bindToController: true,
        link: function(scope: ng.IScope, element: JQuery, attrs: ng.IAttributes, controller: climatediff.ChartController) {

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

}]);

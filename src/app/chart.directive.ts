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

angular.module('cdApp').directive('cdChart', [ 'usSpinnerService', 'Months', function(usSpinnerService, Months) {
    'use strict';

    var TRANSITION_DURATION_MILLIS = 300;

    function expandPoint(tipCallback) {
        return function(e) {
            tipCallback(e);
            d3.select(this).transition()
                .attr('r', 6);
        };
    }
    function collapsePoint(tipCallback) {
        return function(e) {
            tipCallback(e);
            d3.select(this).transition()
                .attr('r', 3);
        };
    }

    function createEmptyArea(xScale, yScale) {
        return d3.svg.area()
            .x(function(d, i) { return xScale(i); })
            .y0(function(d) { return yScale(0); })
            .y1(function(d) { return yScale(0); })
            .interpolate('cardinal');
    }

    function appendCityArea(chart, controller, index, xScale, yScale,
                            maxField, minField ?: any) {

        var data = controller.data;
        if (!data || !data.data || data.data.length === 0) {
            return;
        }

        var city = 'city' + (index + 1);
        if (!data.data[0][city]) {
            console.log('Note: No data in response for city: "' + city + '"');
            return;
        }

        var area = d3.svg.area()
            .x(function(d, i) { return xScale(i); })
            .y0(function(d) { var index = d[city][minField] || 0; return yScale(index); })
            .y1(function(d) { return yScale(d[city][maxField]); })
            .interpolate('cardinal');
        chart.append('path')
            .datum(data.data)
            .attr('class', 'area' + (index+1))
            .attr('d', createEmptyArea(xScale, yScale))
            .transition()
            .duration(TRANSITION_DURATION_MILLIS)
            .attr('d', area);

        if (minField) {
            var minLine = d3.svg.line()
                .x(function(d, i) { return xScale(i); })
                .y(function(d) { return yScale(d[city][minField]); })
                .interpolate('cardinal');
            chart.append('path')
                .datum(data.data)
                .attr('class', 'line' + (index+1))
                .attr('d', minLine);
        }

        var maxLine = d3.svg.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d[city][maxField]); })
            .interpolate('cardinal');
        chart.append('path')
            .datum(data.data)
            .attr('class', 'line' + (index+1))
            .attr('d', maxLine)
            .attr('data-legend', function(d) { return data.metadata[index].city_name; })
            .attr('data-legend-pos', index);

    }

    function appendCityAreaPoints(chart, controller, index, xScale, yScale,
                                  maxVar, minVar ?: any) {

        var data = controller.data;
        if (!data || !data.data || data.data.length === 0) {
            return;
        }

        var city = 'city' + (index + 1);
        if (!data.data[0][city]) {
            console.log('Note: No data in response for city: "' + city + '"');
            return;
        }

        var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
            return d[city][maxVar];
        });
        chart.call(tip);
        tip.offset([ -10, 0 ]);
        var points = chart.selectAll(".point")
            .data(data.data)
            .enter().append("svg:circle")
            .attr('class', 'point' + (index+1))
            .attr("cx", function(d, i) { return xScale(i); })
            .attr("cy", function(d, i) { return yScale(d[city][maxVar]); })
            .attr("r", function(d, i) { return 3; })
            .attr('pointer-events', 'all')
            .on('mouseover', expandPoint(tip.show))
            .on('mouseout', collapsePoint(tip.hide));

        if (minVar) {
            tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
                return d[city][minVar];
            });
            chart.call(tip);
            tip.offset([ -10, 0 ]);
            points = chart.selectAll(".point")
                .data(data.data)
                .enter().append("svg:circle")
                .attr('class', 'point' + (index+1))
                .attr("cx", function(d, i) { return xScale(i); })
                .attr("cy", function(d, i) { return yScale(d[city][minVar]); })
                .attr("r", function(d, i) { return 3; })
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
        var chartMargin = { top: 0, right: 0, bottom: 60, left: 40 };

        // Height of actual chart content area.
        const $chartWrapper = $(element).find('.chart-content');
        const chartW: number = $chartWrapper.width();
        const chartH: number = $chartWrapper.height();
        var chartWidth: number = chartW - chartMargin.left - chartMargin.right;
        var chartHeight: number = chartH - chartMargin.top - chartMargin.bottom;
        const maxProp: string = controller.maxProp;
        const minProp: string = controller.minProp;

        // $(window).on('resize', () => {
        //     const chartW: number = $chartElem.width();
        //     const chartH: number = $chartElem.height();
        //     element.find('svg').get(0).setAttribute('viewBox', '0 0 ' + chartW + ' ' + chartH);
        // })

        var yScale = d3.scale.linear()
            .range([ chartHeight, 0 ]);

        const barPad: number = 0.1;
        var xScale = (<any>d3.scale.ordinal()) // <any> to work around d3 typings issue?
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            .rangeRoundPoints([ 0, chartWidth ], barPad);//barPad, barOuterPad);

        var data = controller.data.data;

        var topPadding = 5;

        var min, max;
        function maxFrom2Cities(entry) {
            var max1 = entry.city1 ? entry.city1[maxProp] : 0;
            var max2 = entry.city2 ? entry.city2[maxProp] : 0;
            return Math.max(max1, max2);
        }
        function minFrom2Cities(entry) {
            var min1 = entry.city1 ? entry.city1[minProp] : 0;
            var min2 = entry.city2 ? entry.city2[minProp] : 0;
            return Math.min(min1, min2);
        }
        if (data.length !== 0) {
            if (minProp) { // Chart is form min - max
                min = d3.min(data, function (entry) {
                    return minFrom2Cities(entry);
                });
                min = Math.min(min, 0);
            }
            else { // Chart is from 0 - value
                min = 0;
            }
            max = d3.max(data, function(entry) { return maxFrom2Cities(entry); });
        }
        else {
            min = 0;
            max = 100;
        }
        yScale.domain([min, max+topPadding]);

        // Remove previous chart, if any
        const $chartElem = $(element).find('.chart');
        var chartDomNode = $chartElem[0];
        d3.select(chartDomNode)
            .select('g').remove();

        var chart = d3.select(chartDomNode)
            .append('g')
            .attr("transform", "translate(" + chartMargin.left + ", " + chartMargin.top + ")");

        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(<any>function(d, i) { return Months.get(i); }); // <any> cast to work around bad typings definition
        chart.append("g")
            .classed({ 'x': true, 'axis': true })
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis)
            // Rotate text on x-axis
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', function(d) { return 'rotate(-65)'; });

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .tickFormat(function(d) { return d + controller.chartConfig.unit; }); // '"'
        chart.append("g")
            .classed({ 'y': true, 'axis': true })
            .call(yAxis);

        appendCityArea(chart, controller, 0, xScale, yScale, maxProp, minProp);
        appendCityArea(chart, controller, 1, xScale, yScale, maxProp, minProp);
        appendCityAreaPoints(chart, controller, 0, xScale, yScale, maxProp, minProp);
        appendCityAreaPoints(chart, controller, 1, xScale, yScale, maxProp, minProp);

        /*var legend = */chart.append('g')
            .attr('class', 'legend')
            .attr('transform', 'translate(50, 30)')
            .style('font-size', '12px')
            .call(d3.legend);

        fixViewBox(element);
//      $scope.resultsLoaded = true;

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

            controller.createChart = function() { createChart(scope, element, controller); }

            var spinnerId = 'spinner-' + controller.spinnerIndex;
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

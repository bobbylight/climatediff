var directives = angular.module('cdDirectives', []);

directives.directive('cdBarChart', [ 'usSpinnerService', function(usSpinnerService) {
   'use strict';
   
   var $previouslySelected;
   
   var months = [ 'January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December' ];
   
   function appendCityArea(chart, $scope, index, xScale, yScale) {
      
      var data = $scope.data;
      
      var city = 'city' + (index + 1);
      
      var area = d3.svg.area()
            .x(function(d, i) { return xScale(i); })
            .y0(function(d) { return yScale(d[city].min); })
            .y1(function(d) { return yScale(d[city].max); })
            .interpolate('cardinal');
      var minLine = d3.svg.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d[city].min); })
            .interpolate('cardinal');
      var maxLine = d3.svg.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d[city].max); })
            .interpolate('cardinal');
      
      chart.append('path')
         .datum(data.data)
         .attr('class', 'area' + (index+1))
         .attr('d', area);
      chart.append('path')
         .datum(data.data)
         .attr('class', 'line' + (index+1))
         .attr('d', minLine)
         .attr('data-legend', function(d) { return data.metadata[index].city_name; })
         .attr('data-legend-pos', index);
      chart.append('path')
         .datum(data.data)
         .attr('class', 'line' + (index+1))
         .attr('d', maxLine);
      
      var points = chart.selectAll(".point")
              .data(data.data)
            .enter().append("svg:circle")
               .attr('class', 'point' + (index+1))
               .attr("cx", function(d, i) { return xScale(i) })
               .attr("cy", function(d, i) { return yScale(d[city].max); })
               .attr("r", function(d, i) { return 3 });
      points = chart.selectAll(".point")
              .data(data.data)
            .enter().append("svg:circle")
               .attr('class', 'point' + (index+1))
               .attr("cx", function(d, i) { return xScale(i) })
               .attr("cy", function(d, i) { return yScale(d[city].min); })
               .attr("r", function(d, i) { return 3 });
      
   }
   
   function createChart($scope) {
      
      // Margins for axes.  Could also be used for spacing, titles, etc.
      var chartMargin = { top: 0, right: 0, bottom: 60, left: 40 };
      
      // Height of actual chart content area.
      var chartWidth = $('#chart').width() - chartMargin.left - chartMargin.right;
      var chartHeight = $('#chart').height() - chartMargin.top - chartMargin.bottom;
      
      var yScale = d3.scale.linear()
            .range([ chartHeight, 0 ]);
      
      var barPad = 0.1;
      var barOuterPad = 0.2;
      var xScale = d3.scale.ordinal()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            .rangeRoundPoints([ 0, chartWidth ], barPad, barOuterPad);
      
      var data = $scope.data;
      
      var topPadding = 5;
      var min = d3.max(data.data, function(entry) { return Math.max(entry.city1.min, entry.city2.min); });
      min = Math.min(min, 0);
      var max = d3.max(data.data, function(entry) { return Math.max(entry.city1.max, entry.city2.max); });
      yScale.domain([min, max+topPadding]);
      
      // Remove previous chart, if any
      d3.select('#chart')
         .select('g').remove();
      
      var chart = d3.select('#chart')
         .append('g')
            .attr("transform", "translate(" + chartMargin.left + ", " + chartMargin.top + ")");

      var xAxis = d3.svg.axis()
         .scale(xScale)
         .orient("bottom")
         .tickFormat(function(d, i) { return months[i]; });
      chart.append("g")
         .classed({ 'x': true, 'axis': true })
         .attr("transform", "translate(0," + chartHeight + ")")
         .call(xAxis)
         // Rotate text on x-axis
         .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', function(d) { return 'rotate(-65)' });
      
      var yAxis = d3.svg.axis()
         .scale(yScale)
         .orient("left")
         .tickFormat(function(d, i) { return d + '\u00b0 F'; });
      chart.append("g")
         .classed({ 'y': true, 'axis': true })
         .call(yAxis);
      
      appendCityArea(chart, $scope, 0, xScale, yScale);
      appendCityArea(chart, $scope, 1, xScale, yScale);
      
      var legend = chart.append('g')
         .attr('class', 'legend')
         .attr('transform', 'translate(50, 30)')
         .style('font-size', '12px')
         .call(d3.legend);
         
//      $scope.resultsLoaded = true;
      
   }
   
   return {
      restrict: 'E',
      link: function(scope, element, attr) {
         
         scope.$watch('data', function(newValue, oldValue) {
            if (newValue === oldValue) {
               return; // First time through
            }
            createChart(scope);
         });
         
         scope.$watch('maskResults', function(newValue, oldValue) {
            if (newValue === oldValue) {
               return; // First time through
            }
            if (newValue) {
               usSpinnerService.spin('spinner-1');
            }
            else {
               usSpinnerService.stop('spinner-1');
            }
         });
         
      },
      templateUrl: 'directives/barChart.html'
   };
   
}]);

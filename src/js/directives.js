var directives = angular.module('cdDirectives', []);

directives.directive('cdBarChart', [ function() {
   'use strict';
   
   var $previouslySelected;
   
   var months = [ 'January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December' ];
   
   function createChart($scope) {
      
      // Margins for axes.  Could also be used for spacing, titles, etc.
      var chartMargin = { top: 0, right: 0, bottom: 60, left: 40 };
      
      // Height of actual chart content area.
      var chartWidth = $('#chart').width() - chartMargin.left - chartMargin.right;
      var chartHeight = $('#chart').height() - chartMargin.top - chartMargin.bottom;
      
      var scale = d3.scale.linear()
            .range([ chartHeight, 0 ]);
      
      var barPad = 0.1;
      var barOuterPad = 0.2;
      var xScale = d3.scale.ordinal()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            .rangeRoundPoints([ 0, chartWidth ], barPad, barOuterPad);
//            .rangeRoundBands([ 0, chartWidth ], barPad, barOuterPad);
//var xScale = d3.scale.ordinal().domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ]).range([ 0, chartWidth ]);

      
      var data = $scope.data;
      
      var topPadding = 5;
      var min = d3.max(data.data, function(entry) { return Math.max(entry.city1.min, entry.city2.min); });
      min = Math.min(min, 0);
      var max = d3.max(data.data, function(entry) { return Math.max(entry.city1.max, entry.city2.max); });
      scale.domain([min, max+topPadding]);
      
      // Remove previous chart, if any
      d3.select('#chart')
         .select('g').remove();
/*
      var chart = d3.select("#chart")
         .append("g")
            .attr("transform", "translate(" + chartMargin.left + ", " + chartMargin.top + ")");
*/
var area = d3.svg.area()
      .x(function(d, i) { return xScale(i); })
      .y0(function(d) { return scale(d.city1.min); })
      .y1(function(d) { return scale(d.city1.max); });
var minLine = d3.svg.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return scale(d.city1.min); });
var maxLine = d3.svg.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return scale(d.city1.max); });

var area2 = d3.svg.area()
      .x(function(d, i) { return xScale(i); })
      .y0(function(d) { return scale(d.city2.min); })
      .y1(function(d) { return scale(d.city2.max); });
var minLine2 = d3.svg.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return scale(d.city2.min); });
var maxLine2 = d3.svg.line()
      .x(function(d, i) { return xScale(i); })
      .y(function(d) { return scale(d.city2.max); });

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
         .scale(scale)
         .orient("left")
         .tickFormat(function(d, i) { return d + '\u00b0 F'; });
      chart.append("g")
         .classed({ 'y': true, 'axis': true })
         .call(yAxis);
      
chart.append('path')
   .datum(data.data)
   .attr('class', 'area')
   .attr('d', area);
chart.append('path')
   .datum(data.data)
   .attr('class', 'line')
   .attr('d', minLine)
   .attr('data-legend', function(d) { return data.metadata[0].city_name; })
   .attr('data-legend-pos', 1);
chart.append('path')
   .datum(data.data)
   .attr('class', 'line')
   .attr('d', maxLine);
chart.append('path')
   .datum(data.data)
   .attr('class', 'area2')
   .attr('d', area2);
chart.append('path')
   .datum(data.data)
   .attr('class', 'line2')
   .attr('d', minLine2)
   .attr('data-legend', function(d) { return data.metadata[1].city_name; })
   .attr('data-legend-pos', 2);
chart.append('path')
   .datum(data.data)
   .attr('class', 'line2')
   .attr('d', maxLine2);
//      var bars = chart
//         .append("g")
//            .selectAll("g")
//            .data(data.data)
//            .enter().append("g")
//               .attr('transform', function(d, i) { return 'translate(' + xScale(i) + ', 0)'; });
//      
//      bars.append("rect")
//         .classed('rect1', true)
//         .attr("x", 0)
//         .attr("y", function(d) { return scale(d.city1.max); })
//         .attr("width", barWidth)
//         .attr("height", function(d) { return chartHeight - scale(d.city1.max); });
//      bars.append("rect")
//         .classed('rect2', true)
//         .attr("x", barWidth + 2)
//         .attr("y", function(d) { return scale(d.city2.max); })
//         .attr("width", barWidth - 1)
//         .attr("height", function(d) { return chartHeight - scale(d.city2.max); });
      
//            bars.append("text")
//               .attr("x", barWidth / 2)
//               .attr("y", function(d) { return scale(d.val1) - 3; })
//               .attr("dx", ".35em")
//               .text(function(d) { return d.val1; });
      
      
      //$('#resultsLabel').html(JSON.stringify(data));
      
      var legend = chart.append('g')
         .attr('class', 'legend')
         .attr('transform', 'translate(50, 30)')
         .style('font-size', '12px')
         .call(d3.legend);
         
      $scope.resultsLoaded = true;
      
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
         
      },
      templateUrl: 'directives/barChart.html'
   };
   
}]);

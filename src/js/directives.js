var directives = angular.module('cdDirectives', []);

directives.directive('cdAreaChart', [ 'usSpinnerService', function(usSpinnerService) {
   'use strict';
   
   var months = [ 'January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December' ];
   
   function createChart($scope, element, chartRenderFunc) {
      
      // Margins for axes.  Could also be used for spacing, titles, etc.
      var chartMargin = { top: 0, right: 0, bottom: 60, left: 40 };
      
      // Height of actual chart content area.
      var $chartElem = $(element).find('.chart');
      var chartWidth = $chartElem.width() - chartMargin.left - chartMargin.right;
      var chartHeight = $chartElem.height() - chartMargin.top - chartMargin.bottom;
      
      var yScale = d3.scale.linear()
            .range([ chartHeight, 0 ]);
      
      var barPad = 0.1;
      var barOuterPad = 0.2;
      var xScale = d3.scale.ordinal()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            .rangeRoundPoints([ 0, chartWidth ], barPad, barOuterPad);
      
      var data = $scope.data;
      
      var topPadding = 5;
      
      var min, max;
      function maxFrom2Cities(entry) {
         var max1 = entry.city1 ? entry.city1.max : 0;
         var max2 = entry.city2 ? entry.city2.max : 0;
         return Math.max(max1, max2);
      }
      function minFrom2Cities(entry) {
         var min1 = entry.city1 ? entry.city1.min : 0;
         var min2 = entry.city2 ? entry.city2.min : 0;
         return Math.min(min1, min2);
      }
      if (data.data.length !== 0) {
         min = d3.min(data.data, function(entry) { return minFrom2Cities(entry); });
         min = Math.min(min, 0);
         max = d3.max(data.data, function(entry) { return maxFrom2Cities(entry); });
      }
      else {
         min = 0;
         max = 100;
      }
//      var min = d3.max(data.data, function(entry) { return Math.max(entry.city1.min, entry.city2.min); });
//      min = Math.min(min, 0);
//      var max = d3.max(data.data, function(entry) { return Math.max(entry.city1.max, entry.city2.max); });
      yScale.domain([min, max+topPadding]);
      
      // Remove previous chart, if any
      var chartDomNode = $chartElem[0];
      d3.select(chartDomNode)
         .select('g').remove();
      
      var chart = d3.select(chartDomNode)
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
            .attr('transform', function(d) { return 'rotate(-65)'; });
      
      var yAxis = d3.svg.axis()
         .scale(yScale)
         .orient("left")
         .tickFormat(function(d, i) { return d + '\u00b0 F'; });
      chart.append("g")
         .classed({ 'y': true, 'axis': true })
         .call(yAxis);
      
      (chartRenderFunc())(chart, $scope, xScale, yScale);
//      appendCityArea(chart, $scope, 0, xScale, yScale);
//      appendCityArea(chart, $scope, 1, xScale, yScale);
      
      /*var legend = */chart.append('g')
         .attr('class', 'legend')
         .attr('transform', 'translate(50, 30)')
         .style('font-size', '12px')
         .call(d3.legend);
         
//      $scope.resultsLoaded = true;
      
   }
   
   return {
      restrict: 'E',
      scope: {
         spinnerIndex: '@spinnerIndex',
         chartTitle: '@title',
         data: '=data',
         mask: '=mask',
         plotter: '&plotter'
      },
      link: function(scope, element, attrs) {
         
         scope.$watch('data', function(newValue, oldValue) {
            if (newValue === oldValue) {
               return; // First time through
            }
            createChart(scope, element, scope.plotter);
         });
         
         var spinnerId = 'spinner-' + scope.spinnerIndex;
         scope.$watch('mask', function(newValue, oldValue) {
            if (newValue === oldValue) {
               return; // First time through
            }
            if (newValue) {
               usSpinnerService.spin(spinnerId);
            }
            else {
               usSpinnerService.stop(spinnerId);
            }
         });
         
      },
      templateUrl: 'directives/areaChart.html'
   };
   
}]);

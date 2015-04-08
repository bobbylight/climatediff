var directives = angular.module('cdDirectives', []);

(function() {
   
   var months = [ 'January', 'February', 'March', 'April', 'May', 'June',
         'July', 'August', 'September', 'October', 'November', 'December' ];
   
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
   
directives.directive('cdTemperatureChart', [ 'usSpinnerService', function(usSpinnerService) {
   'use strict';
   
   function _appendCityArea(chart, $scope, index, xScale, yScale) {
      
      var data = $scope.data;
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
      
   }
   
   function _appendCityAreaPoints(chart, $scope, index, xScale, yScale) {
      
      var data = $scope.data;
      if (!data || !data.data || data.data.length === 0) {
         return;
      }
      
      var city = 'city' + (index + 1);
      if (!data.data[0][city]) {
         console.log('Note: No data in response for city: "' + city + '"');
         return;
      }
      
      var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
         return d[city].max;
      });
      chart.call(tip);
      tip.offset([ -10, 0 ]);
      var points = chart.selectAll(".point")
              .data(data.data)
            .enter().append("svg:circle")
               .attr('class', 'point' + (index+1))
               .attr("cx", function(d, i) { return xScale(i); })
               .attr("cy", function(d, i) { return yScale(d[city].max); })
               .attr("r", function(d, i) { return 3; })
               .attr('pointer-events', 'all')
               .on('mouseover', expandPoint(tip.show))
               .on('mouseout', collapsePoint(tip.hide));
      
      tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
         return d[city].min;
      });
      chart.call(tip);
      tip.offset([ -10, 0 ]);
      points = chart.selectAll(".point")
              .data(data.data)
            .enter().append("svg:circle")
               .attr('class', 'point' + (index+1))
               .attr("cx", function(d, i) { return xScale(i); })
               .attr("cy", function(d, i) { return yScale(d[city].min); })
               .attr("r", function(d, i) { return 3; })
               .attr('pointer-events', 'all')
               .on('mouseover', expandPoint(tip.show))
               .on('mouseout', collapsePoint(tip.hide));
      
   }
   
   function createChart($scope, element) {
      
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
      
      _appendCityArea(chart, $scope, 0, xScale, yScale);
      _appendCityArea(chart, $scope, 1, xScale, yScale);
      _appendCityAreaPoints(chart, $scope, 0, xScale, yScale);
      _appendCityAreaPoints(chart, $scope, 1, xScale, yScale);
      
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
         mask: '=mask'
      },
      link: function(scope, element, attrs) {
         
         scope.$watch('data', function(newValue, oldValue) {
            if (newValue === oldValue) {
               return; // First time through
            }
            createChart(scope, element);
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
      templateUrl: 'directives/tempChart.html'
   };
   
}]);

directives.directive('cdPrecipChart', [ 'usSpinnerService', function(usSpinnerService) {
   'use strict';
   
   var _appendCityPrecipPoints = function(chart, $scope, index, xScale, yScale) {
      
      var data = $scope.data;
      if (!data || !data.data || data.data.length === 0) {
         return;
      }
      
      var city = 'city' + (index + 1);
      if (!data.data[0][city]) {
         console.log('Note: No data in response for city: "' + city + '"');
         return;
      }
      
      var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
         return d[city].precip;
      });
      chart.call(tip);
      tip.offset([ -10, 0 ]);
      /*var points = */chart.selectAll(".point")
              .data(data.data)
            .enter().append("svg:circle")
               .attr('class', 'point' + (index+1))
               .attr("cx", function(d, i) { return xScale(i); })
               .attr("cy", function(d, i) { return yScale(d[city].precip); })
               .attr("r", function(d, i) { return 3; })
               .attr('pointer-events', 'all')
               .on('mouseover', expandPoint(tip.show))
               .on('mouseout', collapsePoint(tip.hide));
      
   };
   
   var _appendCityPrecip = function(chart, $scope, index, xScale, yScale) {
      
      var data = $scope.data;
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
            .y0(function(d) { return yScale(d[city].precip); })
            .y1(function(d) { return yScale(0); })
            .interpolate('cardinal');
      var maxLine = d3.svg.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d[city].precip); })
            .interpolate('cardinal');
      
      chart.append('path')
         .datum(data.data)
         .attr('class', 'area' + (index+1))
         .attr('d', area);
      chart.append('path')
         .datum(data.data)
         .attr('class', 'line' + (index+1))
         .attr('d', maxLine)
         .attr('data-legend', function(d) { return data.metadata[index].city_name; })
         .attr('data-legend-pos', index);
      
   };
   
   function createChart($scope, element) {
      
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
      
      var topPadding = 1;
      
      var min = 0,
          max;
      function maxFrom2Cities(entry) {
         var max1 = entry.city1 ? entry.city1.precip : 0;
         var max2 = entry.city2 ? entry.city2.precip : 0;
         return Math.max(max1, max2);
      }
      if (data.data.length !== 0) {
         max = d3.max(data.data, function(entry) { return maxFrom2Cities(entry); });
      }
      else {
         max = 100;
      }
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
         .tickFormat(function(d, i) { return d + '"'; });
      chart.append("g")
         .classed({ 'y': true, 'axis': true })
         .call(yAxis);
      
      _appendCityPrecip(chart, $scope, 0, xScale, yScale);
      _appendCityPrecip(chart, $scope, 1, xScale, yScale);
      _appendCityPrecipPoints(chart, $scope, 0, xScale, yScale);
      _appendCityPrecipPoints(chart, $scope, 1, xScale, yScale);
      
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
         mask: '=mask'
      },
      link: function(scope, element, attrs) {
         
         scope.$watch('data', function(newValue, oldValue) {
            if (newValue === oldValue) {
               return; // First time through
            }
            createChart(scope, element);
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
      templateUrl: 'directives/precipChart.html'
   };
   
}]);

})();

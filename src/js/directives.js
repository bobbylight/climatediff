var directives = angular.module('cdDirectives', []);

directives.directive('cdBarChart', [ function() {
   'use strict';
   
   var $previouslySelected;
   
   function createChart($scope) {
      
      // Margins for axes.  Could also be used for spacing, titles, etc.
      var chartMargin = { top: 0, right: 0, bottom: 30, left: 40 };
      
      // Height of actual chart content area.
      var chartWidth = $('#chart').width() - chartMargin.left - chartMargin.right;
      var chartHeight = $('#chart').height() - chartMargin.top - chartMargin.bottom;
      
      var barWidth = 30;
      
      var scale = d3.scale.linear()
            .range([ chartHeight, 0 ]);
      
      var xScale = d3.scale.ordinal()
            .rangeRoundBands([ 0, chartWidth ]);
   //         var xScale = d3.scale.linear().range([ 0, chartWidth ]);
      
      d3.csv('data.csv', function(error, data) {
         
         // Convert data from string to numeric
         data.map(function(elem) {
            elem.val1 = parseInt(elem.val1, 10);
            elem.val2 = parseInt(elem.val2, 10);
         });
         
         xScale.domain(data.map(function(entry) { return entry.month; }));
         
         var max = Math.max(
            d3.max(data, function(entry) { return entry.val1; }),
            d3.max(data, function(entry) { return entry.val2; }));
         scale.domain([ 0, max ]);
         
         var chart = d3.select("#chart")
            .append("g")
               .attr("transform", "translate(" + chartMargin.left + ", " + chartMargin.top + ")");
         
         var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");
         chart.append("g")
            .classed({ 'x': true, 'axis': true })
            .attr("transform", "translate(0," + chartHeight + ")")
            .call(xAxis);
         
         var yAxis = d3.svg.axis()
            .scale(scale)
            .orient("left");
         chart.append("g")
            .classed({ 'y': true, 'axis': true })
            .call(yAxis);
         
         var bars = chart
            .append("g")
               .selectAll("g")
               .data(data)
               .enter().append("g")
                  .attr('transform', function(d, i) { return 'translate(' + (xScale(d.month) + xScale.rangeBand()/2 - barWidth) + ', 0)'; });
         
         bars.append("rect")
            .classed('rect1', true)
            .attr("x", 0)
            .attr("y", function(d) { return scale(d.val1); })
            .attr("width", barWidth - 1)
            .attr("height", function(d) { return chartHeight - scale(d.val1); });
         bars.append("rect")
            .classed('rect2', true)
            .attr("x", barWidth + 2)
            .attr("y", function(d) { return scale(d.val2); })
            .attr("width", barWidth - 1)
            .attr("height", function(d) { return chartHeight - scale(d.val2); });
         
   //            bars.append("text")
   //               .attr("x", barWidth / 2)
   //               .attr("y", function(d) { return scale(d.val1) - 3; })
   //               .attr("dx", ".35em")
   //               .text(function(d) { return d.val1; });
         
         
         //$('#resultsLabel').html(JSON.stringify(data));
         
         $scope.resultsLoaded = true;
      });
      
   }
   
   return {
      restrict: 'E',
      link: function(scope, element, attr) {
         
         scope.$watch('data', function(newValue, oldValue) {
            if (newValue === oldValue) {
               return; // First time through
            }
            console.log('Loud and clear!');
            createChart(scope);
         });
         
      },
      templateUrl: 'directives/barChart.html'
   };
   
}]);

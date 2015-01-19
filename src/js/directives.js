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
      
      var scale = d3.scale.linear()
            .range([ chartHeight, 0 ]);
      
      var barPad = 0.1;
      var barOuterPad = 0.2;
      var xScale = d3.scale.ordinal()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ])
            .rangeRoundBands([ 0, chartWidth ], barPad, barOuterPad);

      var barWidth = xScale.rangeBand()/2 - 1;
      
      var data = $scope.data;

      var max = d3.max(data.data, function(entry) { return Math.max(entry.city1.max, entry.city2.max); });
      scale.domain([ 0, max ]);
      
      // Remove previous chart, if any
      d3.select('#chart')
         .select('g').remove();

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
            .data(data.data)
            .enter().append("g")
               .attr('transform', function(d, i) { return 'translate(' + xScale(i) + ', 0)'; });
      
      bars.append("rect")
         .classed('rect1', true)
         .attr("x", 0)
         .attr("y", function(d) { return scale(d.city1.max); })
         .attr("width", barWidth)
         .attr("height", function(d) { return chartHeight - scale(d.city1.max); });
      bars.append("rect")
         .classed('rect2', true)
         .attr("x", barWidth + 2)
         .attr("y", function(d) { return scale(d.city2.max); })
         .attr("width", barWidth - 1)
         .attr("height", function(d) { return chartHeight - scale(d.city2.max); });
      
//            bars.append("text")
//               .attr("x", barWidth / 2)
//               .attr("y", function(d) { return scale(d.val1) - 3; })
//               .attr("dx", ".35em")
//               .text(function(d) { return d.val1; });
      
      
      //$('#resultsLabel').html(JSON.stringify(data));
      
      $scope.resultsLoaded = true;
      
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

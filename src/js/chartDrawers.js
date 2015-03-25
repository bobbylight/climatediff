var chartDrawers = (function() {
   'use strict';
   
   var _appendCityArea = function(chart, $scope, index, xScale, yScale) {
      
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
      
//      console.log('^^^ ' + JSON.stringify(area));
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
               .attr("cx", function(d, i) { return xScale(i); })
               .attr("cy", function(d, i) { return yScale(d[city].max); })
               .attr("r", function(d, i) { return 3; });
      points = chart.selectAll(".point")
              .data(data.data)
            .enter().append("svg:circle")
               .attr('class', 'point' + (index+1))
               .attr("cx", function(d, i) { return xScale(i); })
               .attr("cy", function(d, i) { return yScale(d[city].min); })
               .attr("r", function(d, i) { return 3; });
      
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
            .y1(function(d) { return yScale(yScale); })
            .interpolate('cardinal');
      var maxLine = d3.svg.line()
            .x(function(d, i) { return xScale(i); })
            .y(function(d) { return yScale(d[city].precip); })
            .interpolate('cardinal');
      
//      console.log('^^^ ' + JSON.stringify(area));
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
      
      /*var points = */chart.selectAll(".point")
              .data(data.data)
            .enter().append("svg:circle")
               .attr('class', 'point' + (index+1))
               .attr("cx", function(d, i) { return xScale(i); })
               .attr("cy", function(d, i) { return yScale(d[city].precip); })
               .attr("r", function(d, i) { return 3; });
      
   };
   
   return {
      
      renderTemperatureChart: function(chart, $scope, xScale, yScale) {
         _appendCityArea(chart, $scope, 0, xScale, yScale);
         _appendCityArea(chart, $scope, 1, xScale, yScale);
      },
      
      renderPrecipitationChart: function(chart, $scope, xScale, yScale) {
         _appendCityPrecip(chart, $scope, 0, xScale, yScale);
         _appendCityPrecip(chart, $scope, 1, xScale, yScale);
      }
      
   };
   
})();

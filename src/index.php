<!doctype html>
<html ng-app='cdApp'>

<head>
   <title>ClimateDiff - Quickly compare climates between cities</title>
   <meta charset="utf-8"> 
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
   <link href="css/all.css" rel="stylesheet">
</head>

<body ng-controller='MainCtrl' onload='init()'>

   <?php include 'banner.php'; ?>
   
   <div class='container'>
   
      <form ng-submit='updateClimateDiff()' id='cityForm' role='form' class='form-inline'>
         
         <div class='row'>
         
            <span id='city1-span' class='col-md-3 col-md-offset-2'>
               <label for='city1'>City 1:</label>
               <input type='text' ng-model='city1' class='form-control' placeholder='City name'
                     typeahead="loc for loc in getLocationCompletions($viewValue)" typeahead-loading="loadingLocations1">
               <i ng-show="loadingLocations1" class="glyphicon glyphicon-refresh">Loading...</i>
            </span>
            
            <span id='city2-span' class='col-md-3'>
               <label for='city2'>City 2:</label>
               <input type='text' ng-model='city2' class='form-control' placeholder='City name'
                     typeahead="loc for loc in getLocationCompletions($viewValue)" typeahead-loading="loadingLocations2">
               <i ng-show="loadingLocations2" class="glyphicon glyphicon-refresh">Loading...</i>
            </span>
            
            <span id='submit-span' class='col-md-2'>
               <button type='submit' class='form-control btn btn-primary'>Compare!</button>
            </span>
         </div>
         
         <div class='row'>
            
            
         </div>
         
      </form>
      
      <div id='results' ng-show='resultsLoaded'>
<!--         <div ng-bind='resultsLabel'></div>-->
<!--         <svg id='chart' class='chart'></svg>-->
         <cd-bar-chart></cd-bar-chart>
      </div>
      
   </div>
   
   <!-- build:js js/climatediff.min.js -->
   <script src="../bower_components/jquery/jquery.js"></script>
<!--   <script src='../bower_components/jquery.lazyload/jquery.lazyload.js'></script>-->
   <script src="../bower_components/bootstrap/dist/js/bootstrap.js"></script>
   <script src="../bower_components/d3/d3.js"></script>
   <script src='../bower_components/angular/angular.js'></script>
   <script src='../bower_components/angular-route/angular-route.js'></script>
   <script src="../bower_components/angular-resource/angular-resource.js"></script>
<!--   <script src="../bower_components/angular-bootstrap/build/angular-ui.js"></script>-->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.0/ui-bootstrap-tpls.js"></script>
<!--   <script src='js/services.js'></script>-->
   <script src='js/controllers.js'></script>
   <script src='js/directives.js'></script>
   <script src='js/app.js'></script>
   <!-- endbuild -->

</body>

</html>
<!doctype html>
<html>

<head>
   <title>ClimateDiff - Quickly compare climates between cities</title>
   <meta charset="utf-8"> 
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
   <link href="css/all.css" rel="stylesheet">
</head>

<body onload='init()'>

   <?php include 'banner.php'; ?>
   
   <div class='container'>
   
      <form id='cityForm' role='form' class='form-inline'>
         
         <div class='row'>
         
            <span id='city1-span' class='col-md-3 col-md-offset-2'>
               <label for='city1'>City 1:</label>
               <input type='text' id='city1' name='city1' class='form-control' placeholder='City name'>
            </span>
            
            <span id='city2-span' class='col-md-3'>
               <label for='city2'>City 2:</label>
               <input type='text' id='city2' name='city2' class='form-control' placeholder='City name'>
            </span>
            
            <span id='submit-span' class='col-md-2'>
               <button type='submit' class='form-control btn btn-primary'>Compare!</button>
            </span>
         </div>
         
         <div class='row'>
            
            
         </div>
         
      </form>
      
      <div id='results'>
         <div id='resultsLabel'></div>
         <svg id='chart' class='chart'></svg>
      </div>
      
   </div>
   
   <!-- build:js js/climatediff.min.js -->
   <script src="js/app.js"></script>
   <script src="../bower_components/jquery/jquery.js"></script>
<!--   <script src='../bower_components/jquery.lazyload/jquery.lazyload.js'></script>-->
   <script src="../bower_components/bootstrap/dist/js/bootstrap.js"></script>
   <script src="../bower_components/d3/d3.js"></script>
<!--   <script src='../bower_components/angular/angular.js'></script>-->
<!--   <script src='../bower_components/angular-route/angular-route.js'></script>-->
<!--   <script src="../bower_components/angular-resource/angular-resource.js"></script>-->
<!--   <script src='../bower_components/angular-bindonce/bindonce.js'></script>-->
<!--   <script src='js/services.js'></script>-->
<!--   <script src='js/controllers.js'></script>-->
<!--   <script src='js/directives.js'></script>-->
<!--   <script src='js/app.js'></script>-->
<!--   <script src='js/appUtil.js'></script>-->
   <!-- endbuild -->

<script>
var city1Handle;
var city1 = $('#city1');
city1.on('input', function(e) {
   if (city1Handle) {
      clearTimeout(city1Handle);
      city1Handle = null;
   }
   city1Handle = setTimeout(function() {
      $.ajax('api/locations?input=' + city1.val() + '&limit=10')
         .done(function(response) {
            console.log(response);
         });
   }, 1000);
});
</script>

</body>

</html>
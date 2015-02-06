<!doctype html>
<html ng-app='cdApp'>

<head>
   <title>ClimateDiff - Quickly compare climates between cities</title>
   <meta charset="utf-8"> 
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
   <link href="css/all.css" rel="stylesheet">
</head>

<body ng-controller='MainCtrl'>

   <span us-spinner="{radius:30, width:8, length: 16, top: '90%' }" spinner-key='spinner-99'></span>

   <?php include 'banner.php'; ?>
   
   <div ng-view style='height:100%'></div>
   
<!--   <div class='footer'>-->
<!--      <div class='container'>-->
<!--         Copyright (c) 2015 Climatediff-->
<!--      </div>-->
<!--   </div>-->
   
   <!-- build:js js/climatediff.min.js -->
   <script src="../bower_components/jquery/jquery.js"></script>
   <script src="../bower_components/bootstrap/dist/js/bootstrap.js"></script>
   <script src="../bower_components/d3/d3.js"></script>
   <script src='../bower_components/angular/angular.js'></script>
   <script src='../bower_components/angular-route/angular-route.js'></script>
   <script src="../bower_components/angular-resource/angular-resource.js"></script>
   <script src="../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js"></script>
   <script src="../bower_components/spin.js/spin.js"></script>
   <script src="../bower_components/angular-spinner/angular-spinner.js"></script>
   <script src='js/d3.legend.js'></script>
<!--   <script src='js/services.js'></script>-->
   <script src='js/controllers.js'></script>
   <script src='js/directives.js'></script>
   <script src='js/app.js'></script>
   <!-- endbuild -->

</body>

</html>
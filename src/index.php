<!doctype html>
<html ng-app='cdApp'>

<head>
    <title>ClimateDiff - Quickly compare climates between cities</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="css/all.css" rel="stylesheet">
</head>

<body>
<div id='wrapper'>

    <span us-spinner="{radius:30, width:8, length: 16, top: '90%' }" spinner-key='spinner-99'></span>

    <cd-banner></cd-banner>

    <div class='main-view' ui-view></div>

    <footer class='footer navbar-inverse'>
        <div class='container'>
            <div class='row'>
                &copy; 2016 Climatediff
            </div>
        </div>
    </footer>

    <!-- build:js js/climatediff.min.js -->
    <script src="../bower_components/jquery/jquery.js"></script>
    <script src="../bower_components/bootstrap/dist/js/bootstrap.js"></script>
    <script src="../bower_components/d3/d3.js"></script>
    <script src="../bower_components/d3-tip/index.js"></script>
    <script src='../bower_components/angular/angular.js'></script>
    <script src="../bower_components/angular-resource/angular-resource.js"></script>
    <script src="../bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js"></script>
    <script src="../bower_components/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="../bower_components/spin.js/spin.js"></script>
    <script src="../bower_components/angular-spinner/angular-spinner.js"></script>
    <script src='js/d3.legend.js'></script>
    <script src='js/app.js'></script>
    <script src='js/about-dialog.directive.js'></script>
    <script src='js/banner.directive.js'></script>
    <script src='js/main-page.controller.js'></script>
    <script src='js/utils.service.js'></script>
    <script src='js/month.service.js'></script>
    <script src='js/chart.directive.js'></script>
    <!-- endbuild -->

</div>
</body>

</html>
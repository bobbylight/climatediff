<?php
/*
 * A RESTful API for the climatediff application  See
 * http://www.ietf.org/rfc/rfc2616.txt for more information.
 * Note that this surely isn't a shining example of a REST API, so don't take it as such!
 * 
 * Error conditions aren't quite handled yet, so be careful.
 * 
 * API:
 *    GET http://wherever.com/api/hello/:name
 *       * Returns { "text": "Hello, <name>!" }
 *    GET http://wherever.com/api/locations?input=<input>
 *       * Returns [ { "city_id": "id_1", "city_name": "Anytown, NC 21775" }, ... ]
 *       * Optional 'limit' parameter limits result set size
 */

//require 'codeguy-Slim-4906b77/Slim/Slim.php';
//\Slim\Slim::registerAutoloader();
require 'vendor/autoload.php';

$app = new \Slim\Slim();

$app->get('/hello/:name', function ($name) use ($app) {
    $app->response->headers->set('Content-Type', 'application/json');
    $app->render('hello.php', array('name' => $name));
});

$app->get('/locations', function () use ($app) {
    $app->response->headers->set('Content-Type', 'application/json');
    $app->render('locations.php');
});

$app->get('/temperature/:locId1(/:locId2)', function ($locId1, $locId2 = null) use ($app) {
    $app->response->headers->set('Content-Type', 'application/json');
    $app->render('temperature.php', array('loc1' => $locId1, 'loc2' => $locId2));
});

$app->get('/precipitation/:locId1(/:locId2)', function ($locId1, $locId2 = null) use ($app) {
    $app->response->headers->set('Content-Type', 'application/json');
    $app->render('precipitation.php', array('loc1' => $locId1, 'loc2' => $locId2));
});

$app->error(function(Exception $e) use ($app) {
    $app->response->headers->set('Content-Type', 'application/json');
    $app->response->body(json_encode($e));
});

$app->run();

?>

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

require 'codeguy-Slim-4906b77/Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
$app->response->headers->set('Content-Type', 'application/json');

$app->get('/hello/:name', function ($name) use ($app) {
   $app->render('hello.php', array('name' => $name));
});

$app->get('/locations', function () use ($app) {
   $app->render('locations.php');
});

//$app->get('/game/:system(/:game)', function($system, $game = null) use ($app) {
//   if ($system==='nes') {
//      $app->render('nes.php', array('games' => $game));
//   }
//   else {
//      error("Unknown game system: $system");
//   }
//});

$app->run();

?>

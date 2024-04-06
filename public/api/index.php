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
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

$app = AppFactory::create();

$app->get('/api/hello/{name}', function (Request $request, Response $response, $args) {
    require_once 'hello.php';
    $response->getBody()->write(sayHello($args['name']));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/api/locations', function (Request $request, Response $response) {
    require_once 'locations.php';
    $response->getBody()->write(locations());
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/api/temperature/{locId1}[/{locId2}]', function (Request $request, Response $response, $args) {
    require_once 'temperature.php';
    $loc1 = $args['locId1'] ?? null;
    $loc2 = $args['locId2'] ?? null;
    $debug = isset($_GET['debug']);
    $response->getBody()->write(temperature($loc1, $loc2, $debug));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->get('/api/precipitation/{locId1}[/{locId2}]', function (Request $request, Response $response, $args) {
    require_once 'precipitation.php';
    $loc1 = $args['locId1'] ?? null;
    $loc2 = $args['locId2'] ?? null;
    $debug = isset($_GET['debug']);
    $response->getBody()->write(precipitation($loc1, $loc2, $debug));
    return $response->withHeader('Content-Type', 'application/json');
});

$errorMiddleware = $app->addErrorMiddleware(true, true, true);
//$errorMiddleware->setDefaultErrorHandler(function (
//    Request $request,
//    Throwable $exception,
//    bool $displayErrorDetails,
//    bool $logErrors,
//    bool $logErrorDetails,
//    ?LoggerInterface $logger = null
//) use ($app) {
//    //$logger->error($exception->getMessage());
//
//    $status = 500;
//    if ($exception instanceof \Slim\Exception\HttpException) {
//        $status = $exception->getCode();
//    }
//
//    $payload = ['message' => $exception->getMessage(), 'status' => $status];
//
//    $response = $app->getResponseFactory()->createResponse();
//    $response->getBody()->write(
//        json_encode($payload, JSON_UNESCAPED_UNICODE)
//    );
//
//    return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
//});

$app->run();
?>

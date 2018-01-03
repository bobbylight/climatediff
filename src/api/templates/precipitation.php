<?php
require_once('../init.php');
require_once('_dao.php');
require_once('util.php');

function _fetchCityClimate($loc, &$response, $index, $debug) {

   global $token;

   $locId = getLocationId($loc);
   if (is_null($locId)) {
      header("HTTP/1.1 500 Internal Server Error");
      exit;
   }

   $start = microtime(true);
   $START_DATE='2014-01-01';
   $END_DATE='2014-12-31';
   $offs = 1;
   $limit = 1000;
   $DATA_SET_ID="GHCNDMS";
   $DATA_TYPES="TPCP";
   $decimalCount = 2;

   # If you're having trouble locally, check this out:
   # https://stackoverflow.com/questions/4372710/php-curl-https
   $apiRoot = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data';
#$apiRoot = 'https://205.167.25.172/cdo-web/api/v2/data';

   $results = array();
   $totalTimes = array();
   $curlInfos = array();

   $response['metadata'] = array( 'city_id' => $locId, 'city_name' => $loc);

   # We loop in case we ask for data with > 1000 rows
   # TODO: Prevent making > 5 requests per second!
   $done = false;
   while (!$done) {

      $query = "$apiRoot?offset=$offs&limit=$limit&datasetid=$DATA_SET_ID&datatypeid=$DATA_TYPES&locationid=$locId&startdate=$START_DATE&enddate=$END_DATE";
      $curlResult = _doCurl($query, array( "token: $token" ), $debug);
      if ($debug) {
         array_push($curlInfos, $curlResult['curlInfo']);
      }
      array_push($response['queries'], $query);
      $decodedJson = $curlResult['response'];

      # For some cities we receive {}.  Example: "Raleigh, NC 27605".  Not sure why - no data?
      $results = array_merge($results, isset($decodedJson['results']) ? $decodedJson['results'] : array());
      array_push($totalTimes, microtime(true) - $start);

      if (!isset($decodedJson['metadata'])) {
         _addError($response, 'error.noDataForCity', array( $loc ));
         return;
      }

      $returnedOffs = intval($decodedJson['metadata']['resultset']['offset']);
      $returnedCount = intval($decodedJson['metadata']['resultset']['count']);
      $done = count($results) >= $returnedCount;#($returnedCount < $limit);
      $offs = count($results) + 1;//$returnedOffs + $returnedCount;
   }

   $data = &$response['data'];
   $id = "city$index";

   $response['metadata']['total_time'] = $totalTimes;

   for ($i = 0; $i < 12; $i++) {
      $data[$i] = array();
      $data[$i]['precip'] = 0;
      $data[$i]['precipCount'] = 0;
   }

   foreach ($results as &$result) {
      $datatype = $result['datatype'];
      $date = new DateTime($result['date']);
      $month = $date->format('n') - 1; # Convert from 1-12 to 0-11
      if ($datatype == 'TPCP') {
         $data[$month]['precip'] += $result['value'];
         $data[$month]['precipCount']++;
      }
   }

   for ($month = 0; $month < 12; $month++) {
      if ($data[$month]['precipCount'] == 0) {
         $monthParam = array();
         $monthParam['code'] = "month.$month";
         _addError($response, 'error.noDataForCityForMonth', array( $loc, $monthParam ));
         //$data = [];
         continue;
      }
      $data[$month]['precip'] /= $data[$month]['precipCount'];
# TODO: Not yet sure of unit of measurement.  For now pretending it's tenths of mm (mm * 10)
$inches = ($data[$month]['precip'] / 10) * 0.03937007874;
      $data[$month]['precip'] = round($inches, $decimalCount);
   }

   if ($debug === true) {
      $response['debug']['curlInfo'] = $curlInfos;
   }
}

// Example location IDs:
// Raleigh, NC: CITY:US370017
// FIPS:54081

if (!isset($debug)) {
    $debug = false;
}

# This is the easiest way to return HTTP 500 if e.g. curl_exec times out.
# PHP by default still returns 200 OK for fatal errors (!)
http_response_code(500);

$response = array();
$response[$loc1] = array( 'data' => array(), 'metadata' => array(), 'queries' => array() );
if ($debug) {
    $response[$loc1]['debug'] = array();
}

_fetchCityClimate($loc1, $response[$loc1], 1, $debug);
if (isset($loc2)) {# && !isset($response['metadata'][0]['error'])) {
    $response[$loc2] = array( 'data' => array(), 'metadata' => array(), 'queries' => array() );
    if ($debug) {
        $response[$loc2]['debug'] = array();
    }
   _fetchCityClimate($loc2, $response[$loc2], 2, $debug);
}

http_response_code(200);
echo json_encode($response, JSON_NUMERIC_CHECK);

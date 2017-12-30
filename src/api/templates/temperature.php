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
   $DATA_TYPES="MMNT,MMXT,MNTM";
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
      $results = array_merge($results, (isset($decodedJson['results']) ? $decodedJson['results'] : array()));
      array_push($totalTimes, (microtime(true) - $start));

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
      $data[$i]['min'] = 0;
      $data[$i]['minCount'] = 0;
      $data[$i]['median'] = 0;
      $data[$i]['medianCount'] = 0;
      $data[$i]['max'] = 0;
      $data[$i]['maxCount'] = 0;
   }

   foreach ($results as &$result) {
      $datatype = $result['datatype'];
      $date = new DateTime($result['date']);
      $month = $date->format('n') - 1; # Convert from 1-12 to 0-11
      if ($datatype == 'MMNT') {
         $data[$month]['min'] += $result['value'];
         $data[$month]['minCount']++;
      }
      elseif ($datatype == 'MMXT') {
         $data[$month]['max'] += $result['value'];
         $data[$month]['maxCount']++;
      }
      elseif ($datatype == 'MNTM') {
         $data[$month]['median'] += $result['value'];
         $data[$month]['medianCount']++;
      }
   }

   for ($month = 0; $month < 12; $month++) {
      if ($data[$month]['minCount'] == 0 ||
            $data[$month]['medianCount'] == 0 ||
            $data[$month]['maxCount'] == 0) {
         _addError($response, "No data found for $loc for month $month (" .
               $data[$month]['minCount'] . ', ' .
               $data[$month]['medianCount'] . ', ' .
               $data[$month]['maxCount'] . ').');
         $data = [];
         break;
      }
      $data[$month]['min'] /= $data[$month]['minCount'];
      $data[$month]['min'] /= 10; // Measurements are in tenths of degrees
      $data[$month]['min'] = round($data[$month]['min'], $decimalCount);
      $data[$month]['median'] /= $data[$month]['medianCount'];
      $data[$month]['median'] /= 10; // Measurements are in tenths of degrees
      $data[$month]['median'] = round($data[$month]['median'], $decimalCount);
      $data[$month]['max'] /= $data[$month]['maxCount'];
      $data[$month]['max'] /= 10; // Measurements are in tenths of degrees
      $data[$month]['max'] = round($data[$month]['max'], $decimalCount);
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

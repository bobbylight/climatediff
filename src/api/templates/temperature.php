<?php
require_once('../init.php');
require_once('_dao.php');
require_once('util.php');

function _fetchCityClimate($loc, &$response, $debug) {

   $locId = getLocationId($loc);
   if (is_null($locId)) {
      header("HTTP/1.1 500 Internal Server Error");
      exit;
   }

   $START_DATE='2014-01-01';
   $END_DATE='2014-12-31';
   $DATA_SET_ID="GHCNDMS";
   $DATA_TYPES="MMNT,MMXT,MNTM";
   $decimalCount = 2;

   $response['metadata'] = array( 'city_id' => $locId, 'city_name' => $loc);

   $results = getHistoricalData($loc, $response, $debug, $DATA_SET_ID, $DATA_TYPES, $locId, $START_DATE, $END_DATE);
   if ($results === NULL) { // No data available for this city from the NOAA API
       return;
   }

   $data = &$response['data'];

    for ($i = 0; $i < 12; $i++) {
      $data[$i] = array(
          'min' => 0, 'minCount' => 0,
          'median' => 0, 'medianCount' => 0,
          'max' => 0, 'maxCount' => 0
      );
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

_fetchCityClimate($loc1, $response[$loc1], $debug);
if (isset($loc2)) {# && !isset($response['metadata'][0]['error'])) {
    $response[$loc2] = array( 'data' => array(), 'metadata' => array(), 'queries' => array() );
    if ($debug) {
        $response[$loc2]['debug'] = array();
    }
   _fetchCityClimate($loc2, $response[$loc2], $debug);
}

http_response_code(200);
echo json_encode($response, JSON_NUMERIC_CHECK);

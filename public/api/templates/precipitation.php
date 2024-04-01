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
   $DATA_TYPES="TPCP";
   $decimalCount = 2;

   $response['metadata'] = array( 'city_id' => $locId, 'city_name' => $loc);

   $results = getHistoricalData($loc, $response, $debug, $DATA_SET_ID, $DATA_TYPES, $locId, $START_DATE, $END_DATE);
   if ($results === NULL) { // No data available for this city from the NOAA API
       return;
   }

   $data = &$response['data'];

   for ($i = 0; $i < 12; $i++) {
      $data[$i] = array( 'precip' => 0, 'precipCount' => 0 );
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

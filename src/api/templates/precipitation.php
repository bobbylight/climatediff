<?php
require_once('../init.php');
require_once('_dao.php');

function _doCurl($url, $headers, $debug) {

   $result = array();

   $ch = curl_init($url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
   curl_setopt($ch, CURLOPT_HEADER, 0);
   if ($headers != null) {
      curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
   }
   curl_setopt($ch, CURLOPT_TIMEOUT, 90);
   curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 90);

   $json = curl_exec($ch);
   if ($debug) {
      $result['curlInfo'] = curl_getinfo($ch);
   }

   curl_close($ch);
   #error_log('Raw output: ' . json_decode($json, true) . ', ' . curl_getinfo($ch, CURLINFO_HTTP_COD));

   $result['response'] = json_decode($json, true);
   return $result;
}

function _fetchCityClimate($loc, &$response, $index) {

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
   $debug = true;

   # If you're having trouble locally, check this out:
   # https://stackoverflow.com/questions/4372710/php-curl-https
   $apiRoot = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data';
#$apiRoot = 'https://205.167.25.172/cdo-web/api/v2/data';

   $results = array();
   $totalTimes = array();
   $curlInfos = array();

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

      $returnedOffs = intval($decodedJson['metadata']['resultset']['offset']);
      $returnedCount = intval($decodedJson['metadata']['resultset']['count']);
      $done = count($results) >= $returnedCount;#($returnedCount < $limit);
      $offs = count($results) + 1;//$returnedOffs + $returnedCount;
   }

   $data = &$response['data'];
   $id = "city$index";

   $metadata = &$response['metadata'];
   $cityMetadata = array( 'city_id' => $locId,
         'city_name' => $loc,
         'total_time' => $totalTimes);

   for ($i = 0; $i < 12; $i++) {
      $data[$i][$id]['precip'] = 0;
      $data[$i][$id]['precipCount'] = 0;
   }

   foreach ($results as &$result) {
      $datatype = $result['datatype'];
      $date = new DateTime($result['date']);
      $month = $date->format('n') - 1; # Convert from 1-12 to 0-11
      if ($datatype == 'TPCP') {
         $data[$month][$id]['precip'] += $result['value'];
         $data[$month][$id]['precipCount']++;
      }
   }

   for ($month = 0; $month < 12; $month++) {
      if ($data[$month][$id]['precipCount'] == 0) {
         $cityMetadata['error'] = "No data found for this city for month $month (" .
               $data[$month][$id]['precipCount'] . ').';
         $data = [];
         break;
      }
      $data[$month][$id]['precip'] /= $data[$month][$id]['precipCount'];
# TODO: Not yet sure of unit of measurement.  For now pretending it's tenths of mm (mm * 10)
$inches = ($data[$month][$id]['precip'] / 10) * 0.03937007874;
      $data[$month][$id]['precip'] = round($inches, $decimalCount);
   }

   array_push($metadata, $cityMetadata);

   if ($debug === true) {
      $debugData = &$response['debug'];
      $debugData[$id] = $curlInfos;
   }
}

// Example location IDs:
// Raleigh, NC: CITY:US370017
// FIPS:54081

# This is the easiest way to return HTTP 500 if e.g. curl_exec times out.
# PHP by default still returns 200 OK for fatal errors (!)
http_response_code(500);

$data = array();
for ($i=0; $i < 12; $i++) {
   $monthData = array( 'city1' => array() );
   if (isset($loc2)) {
      $monthData['city2'] = array();
   }
   array_push($data, $monthData);
}
$response = array( 'data' => $data, 'metadata' => array(), 'debug' => array(),
   'queries' => array() );

_fetchCityClimate($loc1, $response, 1);
if (isset($loc2)) {# && !isset($response['metadata'][0]['error'])) {
   _fetchCityClimate($loc2, $response, 2);
}

http_response_code(200);
echo json_encode($response, JSON_NUMERIC_CHECK);

?>

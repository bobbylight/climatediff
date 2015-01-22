<?php
require_once('../init.php');
require_once('_dao.php');

function _getLocId($loc) {
   $matches = getMatchingCities($loc, 4);
   # TODO: What if they type in junk and hit enter?
   if (sizeof($matches) > 0) {
      return $matches[0]['city_id'];
   }
   return null;
}

function _fetchCityClimate($loc, &$response, $index) {
   
   global $token;
   
   $locId = _getLocId($loc);
   if (is_null($locId)) {
      header("HTTP/1.1 500 Internal Server Error");
      exit;
   }
   
   $START_DATE='2014-01-01';
   $END_DATE='2014-12-31';
   $offs = 0;
   $limit = 1000;
   $DATA_SET_ID="GHCNDMS";
   $DATA_TYPES="MMNT,MMXT,MNTM";
   $decimalCount = 2;
   
   $apiRoot = 'http://www.ncdc.noaa.gov/cdo-web/api/v2/data';
   
   $ch = curl_init("$apiRoot?offs=$offs&limit=$limit&datasetid=$DATA_SET_ID&datatypeid=$DATA_TYPES&locationid=$locId&startdate=$START_DATE&enddate=$END_DATE");
   curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
   curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 0);
   curl_setopt($ch, CURLOPT_HEADER, 0);
   curl_setopt($ch, CURLOPT_HTTPHEADER, array( "token: $token" ));
   $json = curl_exec($ch);
   curl_close($ch);
   #echo $json;
   
   # TODO: If result count > 1000, we'll need to make more requests
   
   $decodedJson = json_decode($json, true);
   $results = $decodedJson['results'];
   
   $data = &$response['data'];
   $id = "city$index";
   
   $metadata = &$response['metadata'];
   $cityMetadata = array( 'city_id' => $locId,
         'city_name' => $loc );
   
   for ($i = 0; $i < 12; $i++) {
      $data[$i][$id]['min'] = 0;
      $data[$i][$id]['minCount'] = 0;
      $data[$i][$id]['median'] = 0;
      $data[$i][$id]['medianCount'] = 0;
      $data[$i][$id]['max'] = 0;
      $data[$i][$id]['maxCount'] = 0;
   }
   
   foreach ($results as &$result) {
      $datatype = $result['datatype'];
      $date = new DateTime($result['date']);
      $month = $date->format('n') - 1; # Convert from 1-12 to 0-11
      if ($datatype == 'MMNT') {
         $data[$month][$id]['min'] += $result['value'];
         $data[$month][$id]['minCount']++;
      }
      elseif ($datatype == 'MMXT') {
         $data[$month][$id]['max'] += $result['value'];
         $data[$month][$id]['maxCount']++;
      }
      else {
         $data[$month][$id]['median'] += $result['value'];
         $data[$month][$id]['medianCount']++;
      }
   }
   
   for ($month = 0; $month < 12; $month++) {
      if ($data[$month][$id]['minCount'] == 0 ||
            $data[$month][$id]['medianCount'] == 0 ||
            $data[$month][$id]['maxCount'] == 0) {
         $data = [];
         $cityMetadata['error'] = 'No data found for this city.';
         break;
      }
      $data[$month][$id]['min'] /= $data[$month][$id]['minCount'];
      $data[$month][$id]['min'] /= 10; // Measurements are in tenths of degrees
      $data[$month][$id]['min'] = round($data[$month][$id]['min'], $decimalCount);
      $data[$month][$id]['median'] /= $data[$month][$id]['medianCount'];
      $data[$month][$id]['median'] /= 10; // Measurements are in tenths of degrees
      $data[$month][$id]['median'] = round($data[$month][$id]['median'], $decimalCount);
      $data[$month][$id]['max'] /= $data[$month][$id]['maxCount'];
      $data[$month][$id]['max'] /= 10; // Measurements are in tenths of degrees
      $data[$month][$id]['max'] = round($data[$month][$id]['max'], $decimalCount);
   }
   
   array_push($metadata, $cityMetadata);
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
$response = array( 'data' => $data, 'metadata' => array() );
   
_fetchCityClimate($loc1, $response, 1);
if (isset($loc2) && !isset($response['metadata'][0]['error'])) {
   _fetchCityClimate($loc2, $response, 2);
}

http_response_code(200);
echo json_encode($response, JSON_NUMERIC_CHECK);

?>

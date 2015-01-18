<?php
require_once('../init.php');

// Example location IDs:
// CITY:US370017
// FIPS:54081
$RALEIGH_LOC='CITY:US370017';
$START_DATE='2010-01-01';
$END_DATE='2010-12-31';
$offs = 0;
$limit = 1000;
$DATA_SET_ID="GHCNDMS";
$DATA_TYPES="MMNT,MMXT,MNTM";

$apiRoot = 'http://www.ncdc.noaa.gov/cdo-web/api/v2/data';

$ch = curl_init("$apiRoot?offs=$offs&limit=$limit&datasetid=$DATA_SET_ID&datatypeid=$DATA_TYPES&locationid=$RALEIGH_LOC&startdate=$START_DATE&enddate=$END_DATE");
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 0);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_HTTPHEADER, array( "token: $token" ));
$csv = curl_exec($ch);
curl_close($ch);

echo $csv;

?>

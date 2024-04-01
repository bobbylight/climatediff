<?php


function _createError($key, $params = NULL) {
    $error = array();
    $error['code'] = $key;
    if (isset($params)) {
        $error['params'] = $params;
    }
    return $error;
}

function _addError(&$response, $key, $params = NULL) {
    if (!isset($response['errors'])) {
        $response['errors'] = array();
    }
    array_push($response['errors'], _createError($key, $params));
}

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
    #echo $json;

    $result['response'] = json_decode($json, true);
    return $result;
}

/**
 * Gets historical data for a city.  <code>$response</code> will have metadata and debug info (if applicable) appended
 * to it, but callers are responsible for taking the return value of this method (the actual historical data),
 * massaging it, and merging it into <code>$response</code> themselves.
 */
function getHistoricalData($loc, &$response, $debug, $dataSetId, $dataTypes, $locId, $startDate, $endDate) {

    global $token;

    # If you're having trouble locally, check this out:
    # https://stackoverflow.com/questions/4372710/php-curl-https
    $apiRoot = 'https://www.ncdc.noaa.gov/cdo-web/api/v2/data';
#$apiRoot = 'https://205.167.25.172/cdo-web/api/v2/data';

    $start = microtime(true);
    $results = array();
    $totalTimes = array();
    $curlInfos = array();
    $offs = 1;
    $limit = 1000;

    # We loop in case we ask for data with > 1000 rows
    # TODO: Prevent making > 5 requests per second!
    $done = false;
    while (!$done) {

        $query = "$apiRoot?offset=$offs&limit=$limit&datasetid=$dataSetId&datatypeid=$dataTypes&locationid=$locId&startdate=$startDate&enddate=$endDate";
        $curlResult = _doCurl($query, array( "token: $token" ), $debug);
        if ($debug) {
            array_push($curlInfos, $curlResult['curlInfo']);
        }
        array_push($response['queries'], $query);
        $decodedJson = $curlResult['response'];

        # For some cities we receive {}.  Example: "Raleigh, NC 27605".  Not sure why - no data?
        if (!isset($decodedJson['metadata'])) {
            _addError($response, 'error.noDataForCity', array( $loc ));
            return null;
        }

        $results = array_merge($results, isset($decodedJson['results']) ? $decodedJson['results'] : array());
        array_push($totalTimes, microtime(true) - $start);

        $returnedOffs = intval($decodedJson['metadata']['resultset']['offset']);
        $returnedCount = intval($decodedJson['metadata']['resultset']['count']);
        $done = count($results) >= $returnedCount;#($returnedCount < $limit);
        $offs = count($results) + 1;//$returnedOffs + $returnedCount;
    }

    $response['metadata']['total_time'] = $totalTimes;

    if ($debug) {
        $response['debug']['curlInfo'] = $curlInfos;
    }

    return $results;
}

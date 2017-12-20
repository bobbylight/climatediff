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

?>

<?php
require_once('_dao.php');

$response = "Hello, $name!, " . implode(' ', getMatchingCities($name)[0]);
$data = array('text' => $response);

echo json_encode($data, JSON_NUMERIC_CHECK);

?>

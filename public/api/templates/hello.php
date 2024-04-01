<?php
require_once('_dao.php');

$response = "Hello, $name!";
$data = array('text' => $response);

echo json_encode($data, JSON_NUMERIC_CHECK);

?>

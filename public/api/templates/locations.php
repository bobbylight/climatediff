<?php
require_once('_dao.php');

if (isset($_GET['input'])) {
   $input = $_GET['input'];
}
else {
   $input = '';
}
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 0;

$matches = getMatchingCities($input, $limit);

echo json_encode($matches, JSON_NUMERIC_CHECK);

?>

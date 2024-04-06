<?php
function locations()
{
    require_once('_dao.php');

    $input = $_GET['input'] ?? '';
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 0;
    $matches = getMatchingCities($input, $limit);

    return json_encode($matches, JSON_NUMERIC_CHECK);
}
?>

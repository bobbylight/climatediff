<?php
function sayHello($name)
{
    $response = "Hello, $name!";
    $data = array('text' => $response);

    return json_encode($data, JSON_NUMERIC_CHECK);
}
?>

<?php

function _openConnection() {
   $db = new PDO('sqlite:' . dirname(__FILE__) . '/../all-locations.db');
   // Ugh, see https://bugs.php.net/bug.php?id=44341
   //$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
   //$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
   
   // Gives us error messages when updates fail
   $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   return $db;
}

function getMatchingCities($input) {
   
   $db = _openConnection();
   $input = "$input%";
   
   $sql = "select city_id, city_name from cities where city_name like :input";
   
   $data = array();
   
   $stmt = $db->prepare($sql);
   $stmt->execute(array(':input' => $input));
   while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      array_push($data, $row);
   }
   
   $db = null;
   return $data;
}

?>

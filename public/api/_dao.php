<?php

function _openConnection() {
   $db = new PDO('sqlite:' . dirname(__FILE__) . '/all-locations.db');
   // Ugh, see https://bugs.php.net/bug.php?id=44341
   //$db->setAttribute(PDO::ATTR_STRINGIFY_FETCHES, false);
   //$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

   // Gives us error messages when updates fail
   $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
   return $db;
}

function getLocationId($loc) {
   $matches = getMatchingCities($loc, 4);
   # TODO: What if they type in junk and hit enter?
   if (sizeof($matches) > 0) {
      return $matches[0]['city_id'];
   }
   return null;
}

function getMatchingCities($input, $limit = 0) {

   # Check for bad input
   if (!is_numeric($limit) or $limit < 0) {
      return array();
   }

   $db = _openConnection();

   # All digits => treat as zip code, otherwise treat as start of city name
   if (ctype_digit($input)) {
      $input = "%$input%";
   }
   else {
      $input = "$input%";
   }

   # Note: limit only valid in mysql, sqlite, postgres
   $sql = 'select city_id, city_name from cities where city_name like :input';
   if ($limit > 0) {
      $sql .= " limit $limit";
   }

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
